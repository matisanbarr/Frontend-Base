import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { TenantProyectoPlanService } from '../../../../../core/services/tenant-proyecto-plan.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TenantProyectoPlan } from '../../../../../models/tenantProyectoPlan.model';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenant-proyecto-plan-form',
  standalone: true,
  templateUrl: './pagos-tenants-proyectos-planes-form.component.html',
  styleUrls: ['./pagos-tenants-proyectos-planes-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class PagoTenantProyectoPlanFormComponent implements OnInit, OnChanges {
  @Input() initialData: TenantProyectoPlan | null = null;
  @Output() save = new EventEmitter<TenantProyectoPlan>();
  form: FormGroup;
  loading = false;
  isEdit = false;

  private readonly fb = inject(FormBuilder);
  private readonly tenantProyectoPlanService = inject(TenantProyectoPlanService);

  constructor() {
    this.form = this.fb.group({
      tenantId: [null, Validators.required],
      proyectoId: [null, Validators.required],
      planId: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      fechaVencimiento: [null, Validators.required],
      renovacionAutomatica: [false],
      estadoActivo: [true],
    });
  }

  ngOnInit() {
    this.setFormFromInput();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData']) {
      this.setFormFromInput();
    }
  }

  setFormFromInput() {
    debugger;
    if (this.initialData && this.initialData.id) {
      this.isEdit = true;
      const { id, ...rest } = this.initialData;
      this.form.patchValue({
        ...rest,
      });
    } else {
      this.isEdit = false;
      this.limpiar();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      // Solo incluir id si es edición
      const data = { ...this.form.value };
      if (this.isEdit && this.initialData && this.initialData.id) {
        data.id = this.initialData.id;
        this.tenantProyectoPlanService.modificarTenantProyectoPlan(data).subscribe({
          next: (resp) => {
            this.loading = false;
            if (resp.codigoRespuesta === 0) {
              this.save.emit({ ...data });
              this.limpiar();
            } else if (resp.codigoRespuesta === 1) {
              alert('No se pudo modificar: ' + resp.glosaRespuesta);
            } else {
              alert('Error inesperado: ' + resp.glosaRespuesta);
            }
          },
          error: () => {
            this.loading = false;
            alert('Error de red o servidor.');
          },
        });
      } else {
        // No enviar id en creación
        delete data.id;
        this.tenantProyectoPlanService.crearTenantProyectoPlan(data).subscribe({
          next: (resp) => {
            this.loading = false;
            if (resp.codigoRespuesta === 0) {
              this.save.emit({ ...data });
              this.limpiar();
            } else if (resp.codigoRespuesta === 1) {
              alert('No se pudo guardar: ' + resp.glosaRespuesta);
            } else {
              alert('Error inesperado: ' + resp.glosaRespuesta);
            }
          },
          error: () => {
            this.loading = false;
            alert('Error de red o servidor.');
          },
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  limpiar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const format = (d: Date) => d.toISOString().slice(0, 10);
    this.isEdit = false;
    this.form.reset({
      id: null,
      tenantId: null,
      proyectoId: null,
      planId: null,
      fechaInicio: format(today),
      fechaVencimiento: format(lastDay),
      renovacionAutomatica: false,
      estadoActivo: true,
    });
  }
}

import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { TenantProyectoPlanService } from '../../../../../core/services/tenant-proyecto-plan.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TenantProyectoPlan } from '../../../../../models/tenantProyectoPlan.model';

import { ReactiveFormsModule } from '@angular/forms';
import { TenantSelectorComponent } from '../tenant-selector/tenant-selector.component';
import { ProyectoSelectorComponent } from '../proyecto-selector/proyecto-selector.component';
import { PlanSelectorComponent } from '../plan-selector/plan-selector.component';

@Component({
  selector: 'app-tenant-proyecto-plan-form',
  standalone: true,
  templateUrl: './tenant-proyecto-plan-form.component.html',
  styleUrls: ['./tenant-proyecto-plan-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    TenantSelectorComponent,
    ProyectoSelectorComponent,
    PlanSelectorComponent,
  ],
})
export class TenantProyectoPlanFormComponent implements OnInit {
  @Input() initialData: TenantProyectoPlan | null = null;
  @Output() save = new EventEmitter<TenantProyectoPlan>();
  form: FormGroup;
  loading = false;

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
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.tenantProyectoPlanService.crearTenantProyectoPlan(this.form.value).subscribe({
        next: (resp) => {
          this.loading = false;
          if (resp.codigoRespuesta === 0) {
            this.save.emit(this.form.value);
            this.form.reset({
              tenantId: null,
              proyectoId: null,
              planId: null,
              fechaInicio: null,
              fechaVencimiento: null,
              renovacionAutomatica: false,
              estadoActivo: true,
            });
          } else if (resp.codigoRespuesta === 1) {
            // Manejo de error conocido
            alert('No se pudo guardar: ' + resp.glosaRespuesta);
          } else {
            // Error inesperado
            alert('Error inesperado: ' + resp.glosaRespuesta);
          }
        },
        error: () => {
          this.loading = false;
          alert('Error de red o servidor.');
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}

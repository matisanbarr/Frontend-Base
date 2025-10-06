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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TenantProyectoPlanSelectorComponent } from '../tenants-proyectos-planes-selector/tenants-proyectos-planes-selector.component';
import { PagoTenantProyectoPlan } from '../../../../../models/pagoTenantProyectoPlan.model';
import { BancoCentralService } from '../../../../../core/services/banco-central.service';
import { PagoTenantProyectoPlanService } from '../../../../../core/services/pago-tenant-proyecto-plan.service';

@Component({
  selector: 'app-pagos-tenants-proyectos-planes-form',
  standalone: true,
  templateUrl: './pagos-tenants-proyectos-planes-form.component.html',
  styleUrls: ['./pagos-tenants-proyectos-planes-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, TenantProyectoPlanSelectorComponent],
})
export class PagoTenantProyectoPlanFormComponent implements OnInit, OnChanges {
  mesActual: string;
  @Input() initialData: PagoTenantProyectoPlan | null = null;
  @Output() save = new EventEmitter<PagoTenantProyectoPlan>();
  form: FormGroup;
  loading = false;
  isEdit = false;

  private readonly fb = inject(FormBuilder);
  private readonly bancoCentralService = inject(BancoCentralService);
  private readonly pagoTenantProyectoPlanService = inject(PagoTenantProyectoPlanService);

  ufPrimerDiaMes: number | null = null;
  planPrecioUf: number | null = null;
  planPrecioClp: number | null = null;

  constructor() {
    // Nombre del mes actual en español
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const hoy = new Date();
    this.mesActual = meses[hoy.getMonth()];
    this.form = this.fb.group({
      tenantProyectoPlan: [null, Validators.required],
      fechaPago: [null, Validators.required],
      monto: [0, [Validators.required, Validators.min(0)]],
      observacion: [''],
    });
    // Escuchar cambios en el selector para actualizar el precio
    this.form.get('tenantProyectoPlan')?.valueChanges.subscribe((tpPlan) => {
      this.planPrecioUf = tpPlan?.plan?.precioUfPorProyecto ?? null;
      this.calcularMontoClp();
    });
  }

  ngOnInit() {
    this.setFormFromInput();
    this.obtenerUfPrimerDiaMes();
  }

  obtenerUfPrimerDiaMes() {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fecha = primerDia.toISOString().slice(0, 10);
    this.bancoCentralService.getSeries('F073.UFF.PRE.Z.D', fecha, fecha).subscribe({
      next: (resp) => {
        if (resp?.series?.obs?.length) {
          this.ufPrimerDiaMes = parseFloat(resp.series.obs[0].value);
          this.calcularMontoClp();
        } else {
          this.ufPrimerDiaMes = null;
        }
      },
      error: () => {
        this.ufPrimerDiaMes = null;
      },
    });
  }

  calcularMontoClp() {
    if (this.planPrecioUf && this.ufPrimerDiaMes) {
      this.planPrecioClp = Math.round(this.planPrecioUf * this.ufPrimerDiaMes);
      this.form.get('monto')?.setValue(this.planPrecioClp, { emitEvent: false });
    } else {
      this.planPrecioClp = null;
      this.form.get('monto')?.setValue(null, { emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData']) {
      this.setFormFromInput();
    }
  }

  setFormFromInput() {
    if (this.initialData && this.initialData.id) {
      this.isEdit = true;
      this.form.patchValue({
        tenantProyectoPlan: this.initialData.tenantProyectoPlan,
        fechaPago: this.initialData.fechaPago ? this.formatDate(this.initialData.fechaPago) : null,
        monto: this.initialData.monto,
        observacion: this.initialData.observacion || '',
      });
    } else {
      this.isEdit = false;
      this.limpiar();
    }
  }

  private formatDate(date: string | Date): string {
    // Devuelve yyyy-MM-dd para input type="date"
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      // Preparar el modelo para el backend
      const formValue = this.form.value;
      const data: PagoTenantProyectoPlan = {
        id: this.isEdit && this.initialData?.id ? this.initialData.id : undefined,
        tenantProyectoPlanId: formValue.tenantProyectoPlan?.id,
        fechaPago: formValue.fechaPago,
        monto: formValue.monto,
        observacion: formValue.observacion,
        estadoActivo: true,
      };
      if (this.isEdit && data.id) {
        this.pagoTenantProyectoPlanService.modificarPagoTenantProyectoPlan(data).subscribe({
          next: (resp) => {
            this.loading = false;
            if (resp.codigoRespuesta === 0) {
              this.save.emit({ ...data });
              this.limpiar();
            } else {
              alert('No se pudo modificar: ' + resp.glosaRespuesta);
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
        this.pagoTenantProyectoPlanService.crearPagoTenantProyectoPlan(data).subscribe({
          next: (resp) => {
            this.loading = false;
            if (resp.codigoRespuesta === 0) {
              this.save.emit({ ...data });
              this.limpiar();
            } else {
              alert('No se pudo guardar: ' + resp.glosaRespuesta);
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
    this.isEdit = false;
    const today = new Date();
    this.form.reset({
      tenantProyectoPlan: null,
      fechaPago: today.toISOString().slice(0, 10),
      monto: 0,
      observacion: '',
    });
    this.planPrecioUf = null;
    this.planPrecioClp = null;
  }
}

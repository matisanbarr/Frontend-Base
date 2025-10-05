import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { AdminListComponent } from '../../../shared/components/admin-list/admin-list.component';
import { RouterModule } from '@angular/router';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { AlertService } from '../../../core/services/alert.service';
import { TenantPlanService } from '../../../core/services/tenant-plan.service';
import { TenantService } from '../../../core/services/tenant.service';
import { PlanService } from '../../../core/services/plan.service';
import { TenantPlan } from '../../../models/asignacion-plan.model';
import { Tenant } from '../../../models/tenant.model';
import { Plan } from '../../../models/plan.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';
import { FormButtonsComponent } from '../../../shared/components/form-buttons/form-buttons.component';
import { AdminFormHeaderComponent } from '../../../shared/components/admin-form-header/admin-form-header.component';

@Component({
  selector: 'app-admin-asignacion-planes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmModalComponent,
    RouterModule,
    ToastAlertsComponent,
    AdminListComponent,
    FormButtonsComponent,
    AdminFormHeaderComponent,
  ],
  templateUrl: './admin-asignacion-planes.component.html',
  styleUrls: ['./admin-asignacion-planes.component.scss'],
})
export class AdminAsignacionPlanesComponent {
  get activoControl(): FormControl {
    return this.asignacionForm.get('activo') as FormControl;
  }
  // Funciones para AdminListComponent
  asignacionEmpresaFn = (a: TenantPlan) => this.getTenantNombre(a.tenantId) || null;
  asignacionSubscripcionFn = (a: TenantPlan) => this.getPlanNombre(a.planId) || null;
  asignacionFechaInicioFn = (a: TenantPlan) => this.fechaLarga(a.fechaInicio!) || null;
  asignacionFechaFinFn = (a: TenantPlan) => this.fechaLarga(a.fechaFin!) || null;
  asignacionEstadoFn = (a: TenantPlan) => a.activo;
  asignacionDiasRestantesFn = (a: TenantPlan) => this.getDiasRestantes(a) || null;

  modoEdicion: boolean = false;
  asignacionEditandoId: string | null = null;
  asignacionForm: FormGroup;
  asignaciones: TenantPlan[] = [];
  loading = false;
  showConfirmModal = false;
  asignacionAEliminar: string | null = null;
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalRegistros: number = 0;

  tenants: Tenant[] = [];
  tenantsFiltrados: Tenant[] = [];
  tenantSeleccionado: Tenant | null = null;
  filtroTenant: string = '';

  planes: Plan[] = [];
  planesFiltrados: Plan[] = [];
  planSeleccionado: Plan | null = null;
  filtroPlan: string = '';

  readonly alertService = inject(AlertService);
  readonly tenantPlanService = inject(TenantPlanService);
  readonly tenantService = inject(TenantService);
  readonly planService = inject(PlanService);
  readonly fb = inject(FormBuilder);

  constructor() {
    this.asignacionForm = this.fb.group({
      tenantId: ['', Validators.required],
      planId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      activo: [true],
    });
    this.cargarAsignaciones();
    this.cargarTenants();
    this.cargarPlanes();
  }

  cargarAsignaciones(): void {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    this.tenantPlanService.listarPaginadoTenantsPlanes(filtro).subscribe({
      next: (respuesta: any) => {
        this.asignaciones = respuesta.datos;
        this.totalRegistros = respuesta.total;
        this.totalPaginas = Math.ceil(respuesta.total / filtro.tamano);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  buscarAsignaciones() {
    this.paginaActual = 1;
    this.cargarAsignaciones();
  }

  editarAsignacion(asignacion: TenantPlan) {
    this.modoEdicion = true;
    this.asignacionEditandoId = asignacion.id || null;
    // Convertir fechas a formato yyyy-MM-dd para los inputs tipo date
    const toDateInput = (date: Date | string | undefined) => {
      if (!date) return '';
      const d = typeof date === 'string' ? new Date(date) : date;
      // Ajuste para zona horaria: evitar desfase por UTC
      const off = d.getTimezoneOffset();
      const local = new Date(d.getTime() - off * 60 * 1000);
      return local.toISOString().slice(0, 10);
    };
    this.asignacionForm.patchValue({
      ...asignacion,
      fechaInicio: toDateInput(asignacion.fechaInicio),
      fechaFin: toDateInput(asignacion.fechaFin),
    });
    this.tenantSeleccionado = this.tenants.find((t) => t.id === asignacion.tenantId) || null;
    this.planSeleccionado = this.planes.find((p) => p.id === asignacion.planId) || null;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.asignacionEditandoId = null;
    this.asignacionForm.reset({ activo: true });
    this.tenantSeleccionado = null;
    this.planSeleccionado = null;
  }

  private fechaLarga(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  guardarAsignacion() {
    if (this.asignacionForm.invalid) return;
    const formValue = this.asignacionForm.value;
    const tenant = this.tenants.find((t) => t.id === formValue.tenantId);
    const plan = this.planes.find((p) => p.id === formValue.planId);
    const asignacion: TenantPlan = {
      ...formValue,
      nombreTenant: tenant?.nombre || '',
      nombrePlan: plan?.nombre || '',
    };
    if (this.modoEdicion && this.asignacionEditandoId) {
      asignacion.id = this.asignacionEditandoId;
      this.tenantPlanService.modificarTenantPlan(asignacion).subscribe({
        next: () => {
          this.alertService.success('Asignación actualizada correctamente');
          this.cancelarEdicion();
          this.cargarAsignaciones();
        },
        error: () => this.alertService.error('Error al actualizar la asignación'),
      });
    } else {
      this.tenantPlanService.asignarPlan(asignacion).subscribe({
        next: () => {
          this.alertService.success('Plan asignado correctamente');
          this.asignacionForm.reset({ activo: true });
          this.cargarAsignaciones();
        },
        error: () => this.alertService.error('Error al asignar el plan'),
      });
    }
  }

  eliminarAsignacion(asignacion: TenantPlan) {
    this.asignacionAEliminar = asignacion.id || null;
    this.showConfirmModal = true;
  }

  confirmarEliminacion() {
    if (!this.asignacionAEliminar) return;
    this.tenantPlanService.eliminarTenantPlan(this.asignacionAEliminar).subscribe({
      next: () => {
        this.alertService.success('Asignación eliminada correctamente');
        this.cargarAsignaciones();
      },
      error: () => this.alertService.error('Error al eliminar la asignación'),
    });
    this.cerrarModal();
  }

  cerrarModal() {
    this.showConfirmModal = false;
    this.asignacionAEliminar = null;
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarAsignaciones();
  }

  cargarTenants(): void {
    this.tenants = [];
    this.tenantsFiltrados = [];
    this.tenantService.listarTenants().subscribe({
      next: (resp) => {
        if (!resp || resp.codigoRespuesta !== 0) {
          this.alertService.info(resp?.glosaRespuesta || 'No se encontraron empresas.');
          return;
        }
        const tenants = resp.respuesta || [];
        if (tenants.length === 0) {
          this.alertService.info('No se encontraron empresas.');
          return;
        }
        this.tenants = tenants;
        this.tenantsFiltrados = tenants;
      },
      error: () => {
        this.alertService.error('Error al cargar empresas.');
      },
    });
  }

  cargarPlanes() {
    this.planService.listarPlanes().subscribe({
      next: (planes) => {
        this.planes = planes;
        this.planesFiltrados = planes;
      },
    });
  }

  filtrarTenants() {
    const filtro = this.filtroTenant.trim().toLowerCase();
    if (!filtro) {
      this.tenantsFiltrados = this.tenants;
    } else {
      this.tenantsFiltrados = this.tenants.filter((t) => t.nombre.toLowerCase().includes(filtro));
    }
    this.asignacionForm.patchValue({ tenantId: '' });
    this.tenantSeleccionado = null;
  }

  filtrarPlanes() {
    const filtro = this.filtroPlan.trim().toLowerCase();
    if (!filtro) {
      this.planesFiltrados = this.planes;
    } else {
      this.planesFiltrados = this.planes.filter((p) => p.nombre.toLowerCase().includes(filtro));
    }
    this.asignacionForm.patchValue({ planId: '' });
    this.planSeleccionado = null;
  }

  onSelectTenant(id: string) {
    const found = this.tenants.find((t) => t.id === id) || null;
    this.tenantSeleccionado = found;
    this.asignacionForm.patchValue({ tenantId: id });
  }

  onSelectPlan(id: string) {
    const found = this.planes.find((p) => p.id === id) || null;
    this.planSeleccionado = found;
    this.asignacionForm.patchValue({ planId: id });
  }

  limpiarTenantSeleccionado() {
    this.tenantSeleccionado = null;
    this.asignacionForm.patchValue({ tenantId: '' });
    this.filtroTenant = '';
    this.tenantsFiltrados = this.tenants;
  }

  limpiarPlanSeleccionado() {
    this.planSeleccionado = null;
    this.asignacionForm.patchValue({ planId: '' });
    this.filtroPlan = '';
    this.planesFiltrados = this.planes;
  }

  getTenantNombre(id: string): string {
    return this.tenants.find((t) => t.id === id)?.nombre || 'Empresa';
  }

  getPlanNombre(id: string): string {
    return this.planes.find((p) => p.id === id)?.nombre || 'Subscripción';
  }

  getDiasRestantes(asignacion: TenantPlan): number | null {
    if (!asignacion.fechaFin) return null;
    const hoy = new Date();
    const fin = new Date(asignacion.fechaFin);
    hoy.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    const diff = fin.getTime() - hoy.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { AdminListComponent } from '../../../shared/components/admin-list/admin-list.component';
import { RouterModule } from '@angular/router';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { AlertService } from '../../../core/services/alert.service';
import { TenantService } from '../../../core/services/tenant.service';
import { Tenant } from '../../../models/tenant.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';
import { FormButtonsComponent } from '../../../shared/components/form-buttons/form-buttons.component';
import { AdminFormHeaderComponent } from '../../../shared/components/admin-form-header/admin-form-header.component';

@Component({
  selector: 'app-admin-tenants',
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
  templateUrl: './admin-tenants.component.html',
  styleUrls: ['./admin-tenants.component.scss'],
})
export class AdminTenantsComponent {
  get activoControl(): import('@angular/forms').FormControl {
    return this.tenantForm.get('activo') as import('@angular/forms').FormControl;
  }
  // Funciones para el componente de lista genérico
  tenantNombreFn = (tenant: Tenant) => tenant.nombre;
  tenantCorreoFn = (tenant: Tenant) => tenant.correo || null;
  tenantTelefonoFn = (tenant: Tenant) => tenant.telefono || null;
  tenantDireccionFn = (tenant: Tenant) => tenant.direccion || null;
  tenantEstadoFn = (tenant: Tenant) => (tenant.activo ? 'Activo' : 'Inactivo');

  modoEdicion: boolean = false;
  tenantEditandoId: string | null = null;
  tenantForm: FormGroup;
  tenants: Tenant[] = [];
  loading = false;
  showConfirmModal = false;
  tenantAEliminar: string | null = null;
  tenantANombreEliminar: string | null = null;
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalRegistros: number = 0;

  readonly tenantService = inject(TenantService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  constructor() {
    this.tenantForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      correo: ['', [Validators.email]],
      telefono: ['', [Validators.minLength(7), Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(200)]],
      activo: [true],
    });
    this.cargarTenants();
  }

  cargarTenants(): void {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    this.tenantService.listarPaginadoTenants(filtro).subscribe({
      next: (respuesta: { datos: Tenant[]; total: number }) => {
        this.tenants = respuesta.datos;
        this.totalRegistros = respuesta.total;
        this.totalPaginas = Math.ceil(respuesta.total / filtro.tamano);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  buscarTenants() {
    this.paginaActual = 1;
    this.cargarTenants();
  }

  editarTenant(tenant: Tenant) {
    this.modoEdicion = true;
    this.tenantEditandoId = tenant.id || null;
    this.tenantForm.patchValue(tenant);
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.tenantEditandoId = null;
    this.tenantForm.reset({ activo: true });
  }

  guardarTenant() {
    if (this.tenantForm.invalid) return;
    const tenant: Tenant = { ...this.tenantForm.value };
    if (this.modoEdicion && this.tenantEditandoId) {
      tenant.id = this.tenantEditandoId;
      this.tenantService.modificarTenant(tenant).subscribe({
        next: () => {
          this.alertService.success('Tenant actualizado correctamente');
          this.cancelarEdicion();
          this.cargarTenants();
        },
        error: () => this.alertService.error('Error al actualizar el tenant'),
      });
    } else {
      this.tenantService.crearTenant(tenant).subscribe({
        next: () => {
          this.alertService.success('Tenant creado correctamente');
          this.tenantForm.reset({ activo: true });
          this.cargarTenants();
        },
        error: () => this.alertService.error('Error al crear el tenant'),
      });
    }
  }

  eliminarTenant(tenant: Tenant) {
    this.tenantAEliminar = tenant.id || null;
    this.tenantANombreEliminar = tenant.nombre;
    this.showConfirmModal = true;
  }

  confirmarEliminacion() {
    if (!this.tenantAEliminar) return;
    this.tenantService.eliminarTenant(this.tenantAEliminar).subscribe({
      next: () => {
        this.alertService.success('Tenant eliminado correctamente');
        this.cargarTenants();
      },
      error: () => this.alertService.error('Error al eliminar el tenant'),
    });
    this.cerrarModal();
  }

  cerrarModal() {
    this.showConfirmModal = false;
    this.tenantAEliminar = null;
    this.tenantANombreEliminar = null;
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarTenants();
  }

  goToPanel() {
    window.location.href = '/dashboard';
  }
}

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
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { AdminListComponent } from '../../../shared/components/admin-list/admin-list.component';
import { FormButtonsComponent } from '../../../shared/components/form-buttons/form-buttons.component';
import { AdminFormHeaderComponent } from '../../../shared/components/admin-form-header/admin-form-header.component';
import { TenantService } from '../../../core/services/tenant.service';
import { AlertService } from '../../../core/services/alert.service';
import { Tenant } from '../../../models/tenant.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';

@Component({
  selector: 'app-admin-tenants',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmModalComponent,
    ToastAlertsComponent,
    AdminListComponent,
    FormButtonsComponent,
    AdminFormHeaderComponent,
  ],
  templateUrl: './admin-tenants.component.html',
  styleUrls: ['./admin-tenants.component.scss'],
})
export class AdminTenantsComponent {
  // Funciones para mostrar en la lista
  tenantNombreFn = (t: Tenant) => t.nombre ?? null;
  tenantCorreoFn = (t: Tenant) => t.correo ?? null;
  tenantTelefonoFn = (t: Tenant) => t.telefono ?? null;
  tenantDireccionFn = (t: Tenant) => t.direccion ?? null;
  tenantEstadoActivoFn = (t: Tenant) =>
    typeof t.estadoActivo === 'boolean' ? t.estadoActivo : null;

  tenantForm: FormGroup;
  activoControl;
  tenants: Tenant[] = [];
  loading = false;
  showConfirmModal = false;
  modoEdicion = false;
  tenantEditandoId: string | null = null;
  tenantAEliminar: string | null = null;
  tenantANombreEliminar: string | null = null;
  filtroBusqueda = '';
  paginaActual = 1;
  totalPaginas = 1;
  totalRegistros = 0;

  readonly tenantService = inject(TenantService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  constructor() {
    this.activoControl = this.fb.control(true);
    this.tenantForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required, Validators.maxLength(30)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(200)]],
      activo: this.activoControl,
    });
    // Sincronizar el control de activo con el formulario
    this.activoControl.valueChanges.subscribe((valor) => {
      this.tenantForm.get('activo')?.setValue(valor, { emitEvent: false });
    });
    this.cargarTenants();
  }

  cargarTenants(): Promise<void> {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    return new Promise((resolve, reject) => {
      this.tenantService.listarPaginadoTenants(filtro).subscribe({
        next: (resp) => {
          if (resp?.codigoRespuesta === 0 && resp.respuesta) {
            const respuesta = resp.respuesta as { datos?: Tenant[]; total?: number };
            this.tenants = Array.isArray(respuesta.datos) ? respuesta.datos : [];
            this.totalRegistros = typeof respuesta.total === 'number' ? respuesta.total : 0;
            this.totalPaginas = Math.ceil(this.totalRegistros / filtro.tamano);
          } else if (resp?.codigoRespuesta === 1) {
            this.tenants = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.info?.(resp?.glosaRespuesta || 'No se encontraron empresas.');
          } else {
            this.tenants = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.error(resp?.glosaRespuesta || 'Error al cargar empresas.');
          }
          this.loading = false;
          resolve();
        },
        error: () => {
          this.loading = false;
          this.tenants = [];
          this.totalRegistros = 0;
          this.totalPaginas = 1;
          this.alertService.error('Error al cargar empresas.');
          reject();
        },
      });
    });
  }

  buscarTenants(): void {
    this.paginaActual = 1;
    this.cargarTenants();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarTenants();
  }

  async registrarTenant() {
    this.loading = true;
    if (this.tenantForm.invalid) {
      this.tenantForm.markAllAsTouched();
      this.alertService.error('Por favor, complete todos los campos obligatorios correctamente.');
      this.loading = false;
      return;
    }
    const tenant: Tenant = {
      ...this.tenantForm.value,
      estadoActivo: this.activoControl.value,
    };
    this.tenantService.crearTenant(tenant).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          this.alertService.success(resp?.glosaRespuesta || 'Empresa registrada correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo registrar la empresa.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al registrar empresa');
        }
        await this.cargarTenants();
      },
      error: () => this.alertService.error('Error al registrar empresa'),
      complete: () => (this.loading = false),
    });
  }

  editarTenant(tenant: Tenant): void {
    this.modoEdicion = true;
    this.tenantEditandoId = tenant.id || null;
    this.tenantForm.patchValue({
      nombre: tenant.nombre || '',
      correo: tenant.correo || '',
      rol: tenant.rol || '',
      telefono: tenant.telefono || '',
      direccion: tenant.direccion || '',
      activo: tenant.estadoActivo ?? true,
    });
    // Refuerza la sincronización del switch
    this.activoControl.setValue(tenant.estadoActivo ?? true, { emitEvent: false });
    this.tenantForm.markAsPristine();
  }

  get hayCambios(): boolean {
    return this.modoEdicion && this.tenantForm.dirty;
  }

  async actualizarTenant() {
    this.loading = true;
    if (!this.tenantEditandoId) {
      this.loading = false;
      return;
    }
    if (this.tenantForm.get('nombre')?.invalid) {
      this.alertService.error('El nombre es requerido y debe tener entre 3 y 50 caracteres.');
      this.tenantForm.get('nombre')?.markAsTouched();
      this.loading = false;
      return;
    }
    if (this.tenantForm.get('correo')?.invalid) {
      this.alertService.error('El correo es requerido y debe ser válido.');
      this.tenantForm.get('correo')?.markAsTouched();
      this.loading = false;
      return;
    }
    const tenant: Tenant = {
      ...this.tenantForm.value,
      id: this.tenantEditandoId,
      estadoActivo: this.activoControl.value,
    };
    this.tenantService.modificarTenant(tenant).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          this.alertService.success(resp?.glosaRespuesta || 'Empresa actualizada correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo actualizar la empresa.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al actualizar empresa');
        }
        await this.cargarTenants();
      },
      error: () => this.alertService.error('Error al actualizar empresa'),
      complete: () => (this.loading = false),
    });
  }

  limpiarFormulario(): void {
    this.tenantForm.reset({
      nombre: '',
      correo: '',
      rol: '',
      telefono: '',
      direccion: '',
      activo: true,
    });
    this.activoControl.setValue(true, { emitEvent: false });
    this.modoEdicion = false;
    this.tenantEditandoId = null;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  eliminarTenant(tenant: Tenant): void {
    this.tenantAEliminar = tenant.id || null;
    this.tenantANombreEliminar = tenant.nombre ?? null;
    this.showConfirmModal = true;
  }

  async confirmarEliminacion() {
    if (!this.tenantAEliminar) return;
    this.loading = true;
    this.tenantService.eliminarTenant(this.tenantAEliminar).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.cerrarModal();
          this.alertService.success(resp?.glosaRespuesta || 'Empresa eliminada correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo eliminar la empresa.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al eliminar empresa');
        }
        await this.cargarTenants();
      },
      error: () => this.alertService.error('Error al eliminar empresa'),
      complete: () => (this.loading = false),
    });
  }

  cerrarModal(): void {
    this.showConfirmModal = false;
    this.tenantAEliminar = null;
    this.tenantANombreEliminar = null;
  }
}

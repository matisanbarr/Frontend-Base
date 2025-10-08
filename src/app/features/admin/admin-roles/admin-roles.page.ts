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
import { RolService } from '../../../core/services/rol.service';
import { AlertService } from '../../../core/services/alert.service';
import { Rol } from '../../../models/rol.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';

@Component({
  selector: 'app-admin-roles',
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
  templateUrl: './admin-roles.page.html',
  styleUrls: ['./admin-roles.page.scss'],
})
export class AdminRolesPage {
  // Funciones para mostrar en la lista
  rolNombreFn = (r: Rol) => r.nombre ?? null;
  rolDescriptionFn = (r: Rol) => r.descripcion ?? null;
  rolEstadoActivoFn = (r: Rol) => (typeof r.estadoActivo === 'boolean' ? r.estadoActivo : null);

  rolForm: FormGroup;
  estadoActivoControl;
  roles: Rol[] = [];
  loading = false;
  showConfirmModal = false;
  modoEdicion = false;
  rolEditandoId: string | null = null;
  rolAEliminar: string | null = null;
  rolANombreEliminar: string | null = null;
  filtroBusqueda = '';
  paginaActual = 1;
  totalPaginas = 1;
  totalRegistros = 0;

  readonly rolService = inject(RolService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  constructor() {
    this.estadoActivoControl = this.fb.control(true);
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(200)]],
      estadoActivo: this.estadoActivoControl,
    });
    // Sincronizar el control de estadoActivo con el formulario
    this.estadoActivoControl.valueChanges.subscribe((valor) => {
      this.rolForm.get('estadoActivo')?.setValue(valor, { emitEvent: false });
    });
    this.cargarRoles();
  }

  cargarRoles(): Promise<void> {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    return new Promise((resolve, reject) => {
      this.rolService.listarPaginadoRoles(filtro).subscribe({
        next: (resp) => {
          if (resp?.codigoRespuesta === 0 && resp.respuesta) {
            const respuesta = resp.respuesta as { datos?: Rol[]; total?: number };
            this.roles = Array.isArray(respuesta.datos) ? respuesta.datos : [];
            this.totalRegistros = typeof respuesta.total === 'number' ? respuesta.total : 0;
            this.totalPaginas = Math.ceil(this.totalRegistros / filtro.tamano);
          } else if (resp?.codigoRespuesta === 1) {
            this.roles = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.info?.(resp?.glosaRespuesta || 'No se encontraron roles.');
          } else {
            this.roles = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.error(resp?.glosaRespuesta || 'Error al cargar roles');
          }
          resolve();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.roles = [];
          this.totalRegistros = 0;
          this.totalPaginas = 1;
          this.alertService.error('Error al cargar roles');
          reject();
        },
      });
    });
  }

  buscarRoles(): void {
    this.paginaActual = 1;
    this.cargarRoles();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarRoles();
  }

  async registrarRol() {
    this.loading = true;
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      this.alertService.error('Por favor, complete todos los campos obligatorios correctamente.');
      this.loading = false;
      return;
    }
    const rol: Rol = {
      ...this.rolForm.value,
      estadoActivo: this.estadoActivoControl.value,
    };
    this.loading = true;
    this.rolService.crearRol(rol).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          this.alertService.success(resp?.glosaRespuesta || 'Rol registrado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo registrar el rol.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al registrar rol');
        }
        await this.cargarRoles();
      },
      error: () => this.alertService.error('Error al registrar rol'),
      complete: () => (this.loading = false),
    });
  }

  editarRol(rol: Rol): void {
    this.modoEdicion = true;
    this.rolEditandoId = rol.id || null;
    this.rolForm.patchValue({
      nombre: rol.nombre || '',
      descripcion: rol.descripcion || '',
      estadoActivo: rol.estadoActivo ?? true,
    });
    // Refuerza la sincronización del switch
    this.estadoActivoControl.setValue(rol.estadoActivo ?? true, { emitEvent: false });
    this.rolForm.markAsPristine();
  }

  get hayCambios(): boolean {
    return this.modoEdicion && this.rolForm.dirty;
  }

  async actualizarRol() {
    this.loading = true;
    if (!this.rolEditandoId) return;
    this.loading = false;
    if (this.rolForm.get('nombre')?.invalid) {
      this.alertService.error('El nombre es requerido y debe tener entre 3 y 50 caracteres.');
      this.rolForm.get('nombre')?.markAsTouched();
      this.loading = false;
      return;
    }
    const rol: Rol = {
      ...this.rolForm.value,
      id: this.rolEditandoId,
      estadoActivo: this.estadoActivoControl.value,
    };
    this.loading = true;
    this.rolService.modificarRol(rol).subscribe({
      next: async (resp) => {
        await this.cargarRoles();
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          this.alertService.success(resp?.glosaRespuesta || 'Rol actualizado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo actualizar el rol.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al actualizar rol');
        }
      },
      error: () => this.alertService.error('Error al actualizar rol'),
      complete: () => (this.loading = false),
    });
  }

  limpiarFormulario(): void {
    this.rolForm.reset({
      nombre: '',
      descripcion: '',
      estadoActivo: true,
    });
    this.estadoActivoControl.setValue(true, { emitEvent: false });
    this.modoEdicion = false;
    this.rolEditandoId = null;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  eliminarRol(rol: Rol): void {
    if (!rol || !rol.id) {
      this.alertService.error('No se pudo identificar el rol a eliminar.');
      return;
    }
    this.rolAEliminar = rol.id;
    this.rolANombreEliminar = rol.nombre ?? null;
    this.showConfirmModal = true;
  }

  async confirmarEliminacion() {
    if (!this.rolAEliminar) return;
    this.loading = true;
    this.rolService.eliminarRol(this.rolAEliminar).subscribe({
      next: async (resp) => {
        this.cerrarModal();
        if (resp?.codigoRespuesta === 0) {
          this.alertService.success(resp?.glosaRespuesta || 'Rol eliminado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo eliminar el rol.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al eliminar rol');
        }
        await this.cargarRoles();
      },
      error: () => this.alertService.error('Error al eliminar rol'),
      complete: () => (this.loading = false),
    });
  }

  cerrarModal(): void {
    this.showConfirmModal = false;
    this.rolAEliminar = null;
    this.rolANombreEliminar = null;
  }
}

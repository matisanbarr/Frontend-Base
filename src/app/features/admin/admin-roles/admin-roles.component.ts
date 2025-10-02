import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { AdminListComponent } from '../../../shared/components/admin-list/admin-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../../core/services/rol.service';
import { RouterModule } from '@angular/router';
import { Rol } from '../../../models/rol.model';
import { AlertService } from '../../../core/services/alert.service';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmModalComponent,
    RouterModule,
    ToastAlertsComponent,
    AdminListComponent,
  ],
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.scss'],
})
export class AdminRolesComponent {
  // Funciones para el componente de lista genérico
  rolNombreFn = (rol: Rol) => rol.nombre || null;
  rolDescriptionFn = (rol: Rol) => rol.descripcion || null;

  modoEdicion: boolean = false;
  rolEditandoId: string | null = null;
  rolForm: FormGroup;
  roles: Rol[] = [];
  loading = false;
  showConfirmModal = false;
  rolAEliminar: string | null = null;
  rolANombreEliminar: string | null = null;
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalRegistros: number = 0;

  readonly rolService = inject(RolService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  constructor() {
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(200)]],
    });
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    this.rolService.listarPaginadoRoles(filtro).subscribe({
      next: (respuesta: { datos: Rol[]; total: number }) => {
        this.roles = respuesta.datos;
        this.totalRegistros = respuesta.total;
        this.totalPaginas = Math.ceil(respuesta.total / filtro.tamano);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  buscarRoles(): void {
    this.paginaActual = 1;
    this.cargarRoles();
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarRoles();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarRoles();
    }
  }
  crearRol(): void {
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }
    if (this.modoEdicion && this.rolEditandoId) {
      // Modificar rol existente
      const rolModificado: Rol = {
        id: this.rolEditandoId,
        nombre: this.rolForm.value.nombre,
        descripcion: this.rolForm.value.descripcion,
      };
      this.rolService.modificarRol(rolModificado).subscribe({
        next: () => {
          this.cargarRoles();
          this.rolForm.reset();
          this.modoEdicion = false;
          this.rolEditandoId = null;
          this.alertService.success('El rol ha sido modificado correctamente.');
        },
        error: (err) => {
          this.alertService.error('No se pudo modificar el rol. Intenta nuevamente.');
        },
      });
    } else {
      // Crear nuevo rol
      const nuevoRol: Rol = {
        nombre: this.rolForm.value.nombre,
        descripcion: this.rolForm.value.descripcion,
      };
      this.rolService.crearRol(nuevoRol).subscribe({
        next: () => {
          this.cargarRoles();
          this.rolForm.reset();
          this.alertService.success('El rol ha sido creado exitosamente.');
        },
        error: (err) => {
          this.alertService.error('No se pudo crear el rol. Intenta nuevamente.');
        },
      });
    }
  }

  editarRol(rol: Rol): void {
    this.modoEdicion = true;
    this.rolEditandoId = rol.id || null;
    this.rolForm.patchValue({
      nombre: rol.nombre,
      descripcion: rol.descripcion || '',
    });
  }

  eliminarRol(rol: Rol): void {
    this.rolAEliminar = rol.id!;
    this.rolANombreEliminar = rol.nombre;
    this.showConfirmModal = true;
  }

  confirmarEliminacion(): void {
    if (!this.rolAEliminar) return;
    this.rolService.eliminarRol(this.rolAEliminar).subscribe({
      next: () => {
        this.cargarRoles();
        this.cerrarModal();
        this.alertService.success('El rol ha sido eliminado correctamente.');
      },
      error: (err) => {
        this.cerrarModal();
        this.alertService.error('No se pudo eliminar el rol. Intenta nuevamente.');
      },
    });
  }

  limpiarFormulario(): void {
    this.rolForm.reset();
    this.modoEdicion = false;
    this.rolEditandoId = null;
  }

  cerrarModal(): void {
    this.modoEdicion = false;
    this.rolEditandoId = null;
    this.showConfirmModal = false;
    this.rolAEliminar = null;
  }
}

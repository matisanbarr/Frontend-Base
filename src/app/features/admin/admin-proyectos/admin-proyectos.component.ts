import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { AdminListComponent } from '../../../shared/components/admin-list/admin-list.component';
import { RouterModule } from '@angular/router';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { AlertService } from '../../../core/services/alert.service';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { Proyecto } from '../../../models/proyecto.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';
import { FormButtonsComponent } from '../../../shared/components/form-buttons/form-buttons.component';
import { AdminFormHeaderComponent } from '../../../shared/components/admin-form-header/admin-form-header.component';

@Component({
  selector: 'app-admin-proyectos',
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
  templateUrl: './admin-proyectos.component.html',
  styleUrls: ['./admin-proyectos.component.scss'],
})
export class AdminProyectosComponent {
  // Funciones para AdminListComponent
  proyectoNombreFn = (p: Proyecto) => p.nombre ?? null;
  proyectoDescripcionFn = (p: Proyecto) => p.descripcion ?? 'Sin descripción';
  proyectoEstadoActivoFn = (p: Proyecto) => p.estadoActivo ?? null;
  estadoActivoControl: import('@angular/forms').FormControl;
  proyectoForm: FormGroup;
  proyectos: Proyecto[] = [];
  loading = false;
  showConfirmModal = false;
  modoEdicion = false;
  proyectoEditandoId: string | null = null;
  proyectoAEliminar: string | null = null;
  proyectoANombreEliminar: string | null = null;
  filtroBusqueda = '';
  paginaActual = 1;
  totalPaginas = 1;
  totalRegistros = 0;

  readonly proyectoService = inject(ProyectoService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  constructor() {
    this.estadoActivoControl = this.fb.control(true);
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(200)]],
      tagId: [null, [Validators.required]],
      estadoActivo: this.estadoActivoControl,
    });
    // Detectar cambios en estadoActivo y marcar dirty si cambia
    this.estadoActivoControl.valueChanges.subscribe((valor) => {
      this.proyectoForm.get('estadoActivo')?.setValue(valor, { emitEvent: false });
      this.estadoActivoControl.markAsDirty();
      this.proyectoForm.markAsDirty();
    });
    this.cargarProyectos();
  }

  cargarProyectos(): Promise<void> {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    return new Promise((resolve, reject) => {
      this.proyectoService.listarPaginadoProyectos(filtro).subscribe({
        next: (resp) => {
          if (
            resp?.codigoRespuesta === 0 &&
            resp.respuesta &&
            Array.isArray(resp.respuesta.datos)
          ) {
            this.proyectos = resp.respuesta.datos;
            this.totalRegistros =
              typeof resp.respuesta.total === 'number' ? resp.respuesta.total : 0;
            this.totalPaginas = Math.ceil(this.totalRegistros / filtro.tamano);
          } else if (resp?.codigoRespuesta === 1) {
            this.proyectos = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.info?.(resp?.glosaRespuesta || 'No se encontraron proyectos.');
          } else {
            this.proyectos = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.error(resp?.glosaRespuesta || 'Error al cargar proyectos');
          }
          this.loading = false;
          resolve();
        },
        error: () => {
          this.loading = false;
          this.proyectos = [];
          this.totalRegistros = 0;
          this.totalPaginas = 1;
          this.alertService.error('Error al cargar proyectos');
          reject();
        },
      });
    });
  }

  buscarProyectos(): void {
    this.paginaActual = 1;
    this.cargarProyectos();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarProyectos();
  }

  async registrarProyecto() {
    if (this.proyectoForm.invalid) {
      this.proyectoForm.markAllAsTouched();
      this.alertService.error('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }
    const proyecto: Proyecto = {
      ...this.proyectoForm.value,
    };
    this.loading = true;
    this.proyectoService.crearProyecto(proyecto).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          await this.cargarProyectos();
          this.alertService.success(resp?.glosaRespuesta || 'Proyecto registrado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo registrar el proyecto.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al registrar proyecto');
        }
      },
      error: () => this.alertService.error('Error al registrar proyecto'),
      complete: () => (this.loading = false),
    });
  }

  editarProyecto(proyecto: Proyecto): void {
    this.modoEdicion = true;
    this.proyectoEditandoId = proyecto.id || null;
    this.proyectoForm.patchValue({
      nombre: proyecto.nombre || '',
      descripcion: proyecto.descripcion || '',
      tagId: typeof proyecto.tagId === 'number' ? proyecto.tagId : null,
      estadoActivo: proyecto.estadoActivo ?? true,
    });
    this.estadoActivoControl.setValue(proyecto.estadoActivo ?? true, { emitEvent: false });
    this.proyectoForm.markAsPristine();
  }

  get hayCambios(): boolean {
    return true;
  }

  async actualizarProyecto() {
    if (!this.proyectoEditandoId) return;
    if (this.proyectoForm.get('nombre')?.invalid) {
      this.alertService.error('El nombre es requerido y debe tener entre 3 y 50 caracteres.');
      this.proyectoForm.get('nombre')?.markAsTouched();
      return;
    }
    const proyecto: Proyecto = {
      ...this.proyectoForm.value,
      id: this.proyectoEditandoId,
    };
    this.loading = true;
    this.proyectoService.modificarProyecto(proyecto).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          await this.cargarProyectos();
          this.alertService.success(resp?.glosaRespuesta || 'Proyecto actualizado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo actualizar el proyecto.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al actualizar proyecto');
        }
      },
      error: () => this.alertService.error('Error al actualizar proyecto'),
      complete: () => (this.loading = false),
    });
  }

  limpiarFormulario(): void {
    this.proyectoForm.reset({
      nombre: '',
      descripcion: '',
      tagId: null,
      estadoActivo: true,
    });
    this.modoEdicion = false;
    this.proyectoEditandoId = null;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  eliminarProyecto(proyecto: Proyecto): void {
    if (!proyecto || !proyecto.id) {
      this.alertService.error('No se pudo identificar el proyecto a eliminar.');
      return;
    }
    this.proyectoAEliminar = proyecto.id;
    this.proyectoANombreEliminar = proyecto.nombre ?? null;
    this.showConfirmModal = true;
  }

  async confirmarEliminacion() {
    if (!this.proyectoAEliminar) return;
    this.loading = true;
    this.proyectoService.eliminarProyecto(this.proyectoAEliminar).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.cerrarModal();
          await this.cargarProyectos();
          this.alertService.success(resp?.glosaRespuesta || 'Proyecto eliminado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo eliminar el proyecto.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al eliminar proyecto');
        }
      },
      error: () => this.alertService.error('Error al eliminar proyecto'),
      complete: () => (this.loading = false),
    });
  }

  cerrarModal(): void {
    this.showConfirmModal = false;
    this.proyectoAEliminar = null;
    this.proyectoANombreEliminar = null;
  }
}

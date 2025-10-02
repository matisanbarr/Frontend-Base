import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { RouterModule } from '@angular/router';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { AlertService } from '../../../core/services/alert.service';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { TenantService } from '../../../core/services/tenant.service';
import { Proyecto } from '../../../models/proyecto.model';
import { Tenant } from '../../../models/tenant.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';

@Component({
  selector: 'app-admin-proyectos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent, RouterModule, ToastAlertsComponent],
  templateUrl: './admin-proyectos.component.html',
  styleUrls: ['./admin-proyectos.component.scss']
})
export class AdminProyectosComponent {
  modoEdicion: boolean = false;
  proyectoEditandoId: string | null = null;
  proyectoForm: FormGroup;
  proyectos: Proyecto[] = [];
  loading = false;
  showConfirmModal = false;
  proyectoAEliminar: string | null = null;
  proyectoANombreEliminar: string | null = null;
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalRegistros: number = 0;

  readonly proyectoService = inject(ProyectoService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  constructor() {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(200)]]
    });
    this.cargarProyectos();
  }



  cargarProyectos(): void {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    this.proyectoService.listarPaginadoProyectos(filtro).subscribe({
      next: (respuesta: any) => {
        this.proyectos = respuesta.datos;
        this.totalRegistros = respuesta.total;
        this.totalPaginas = Math.ceil(respuesta.total / filtro.tamano);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  buscarProyectos() {
    this.paginaActual = 1;
    this.cargarProyectos();
  }

  editarProyecto(proyecto: Proyecto) {
    this.modoEdicion = true;
    this.proyectoEditandoId = proyecto.id || null;
    this.proyectoForm.patchValue(proyecto);
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.proyectoEditandoId = null;
    this.proyectoForm.reset();
  }

  guardarProyecto() {
    if (this.proyectoForm.invalid) return;
    const proyecto: Proyecto = { ...this.proyectoForm.value };
    if (this.modoEdicion && this.proyectoEditandoId) {
      proyecto.id = this.proyectoEditandoId;
      this.proyectoService.modificarProyecto(proyecto).subscribe({
        next: () => {
          this.alertService.success('Proyecto actualizado correctamente');
          this.cancelarEdicion();
          this.cargarProyectos();
        },
        error: () => this.alertService.error('Error al actualizar el proyecto')
      });
    } else {
      this.proyectoService.crearProyecto(proyecto).subscribe({
        next: () => {
          this.alertService.success('Proyecto creado correctamente');
          this.proyectoForm.reset();
          this.cargarProyectos();
        },
        error: () => this.alertService.error('Error al crear el proyecto')
      });
    }
  }

  eliminarProyecto(proyecto: Proyecto) {
    this.proyectoAEliminar = proyecto.id || null;
    this.proyectoANombreEliminar = proyecto.nombre;
    this.showConfirmModal = true;
  }

  confirmarEliminacion() {
    if (!this.proyectoAEliminar) return;
    this.proyectoService.eliminarProyecto(this.proyectoAEliminar).subscribe({
      next: () => {
        this.alertService.success('Proyecto eliminado correctamente');
        this.cargarProyectos();
      },
      error: () => this.alertService.error('Error al eliminar el proyecto')
    });
    this.cerrarModal();
  }

  cerrarModal() {
    this.showConfirmModal = false;
    this.proyectoAEliminar = null;
    this.proyectoANombreEliminar = null;
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarProyectos();
  }

   limpiarFormulario(): void {
    this.proyectoForm.reset();
    this.modoEdicion = false;
    this.proyectoEditandoId = null;
  }
}
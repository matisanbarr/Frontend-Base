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
import { PlanService } from '../../../core/services/plan.service';
import { Plan } from '../../../models/plan.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';
import { FormButtonsComponent } from '../../../shared/components/form-buttons/form-buttons.component';
import { AdminFormHeaderComponent } from '../../../shared/components/admin-form-header/admin-form-header.component';

@Component({
  selector: 'app-admin-planes',
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
  templateUrl: './admin-planes.component.html',
  styleUrls: ['./admin-planes.component.scss'],
})
export class AdminPlanesComponent {
  get estaActivoControl(): import('@angular/forms').FormControl {
    return this.planForm.get('estaActivo') as import('@angular/forms').FormControl;
  }
  // Funciones para AdminListComponent
  planNombreFn = (plan: Plan) => plan.nombre || null;
  descripcionFn = (plan: Plan) => plan.descripcion || null;
  precioFn = (plan: Plan) => plan.precio || null;
  maximoUsuariosFn = (plan: Plan) => plan.maximoUsuarios || null;
  planEstadoFn = (plan: Plan) => (plan.estaActivo ? 'Activo' : 'Inactivo');

  modoEdicion: boolean = false;
  planEditandoId: string | null = null;
  planForm: FormGroup;
  planes: Plan[] = [];
  loading = false;
  showConfirmModal = false;
  planAEliminar: string | null = null;
  planANombreEliminar: string | null = null;
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalRegistros: number = 0;

  readonly planService = inject(PlanService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  constructor() {
    this.planForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.minLength(3), Validators.maxLength(200)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      maximoUsuarios: [1, [Validators.required, Validators.min(1)]],
      estaActivo: [true],
    });
    this.cargarPlanes();
  }

  cargarPlanes(): void {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    this.planService.listarPaginadoPlanes(filtro).subscribe({
      next: (respuesta: { datos: Plan[]; total: number }) => {
        this.planes = respuesta.datos;
        this.totalRegistros = respuesta.total;
        this.totalPaginas = Math.ceil(respuesta.total / filtro.tamano);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  buscarPlanes() {
    this.paginaActual = 1;
    this.cargarPlanes();
  }

  editarPlan(plan: Plan) {
    this.modoEdicion = true;
    this.planEditandoId = plan.id || null;
    this.planForm.patchValue(plan);
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.planEditandoId = null;
    this.planForm.reset({ estaActivo: true });
  }

  guardarPlan() {
    if (this.planForm.invalid) return;
    const plan: Plan = { ...this.planForm.value };
    if (this.modoEdicion && this.planEditandoId) {
      plan.id = this.planEditandoId;
      this.planService.modificarPlan(plan).subscribe({
        next: () => {
          this.alertService.success('Plan actualizado correctamente');
          this.cancelarEdicion();
          this.cargarPlanes();
        },
        error: () => this.alertService.error('Error al actualizar el plan'),
      });
    } else {
      this.planService.crearPlan(plan).subscribe({
        next: () => {
          this.alertService.success('Plan creado correctamente');
          this.planForm.reset({ estaActivo: true });
          this.cargarPlanes();
        },
        error: () => this.alertService.error('Error al crear el plan'),
      });
    }
  }

  eliminarPlan(plan: Plan) {
    this.planAEliminar = plan.id || null;
    this.planANombreEliminar = plan.nombre;
    this.showConfirmModal = true;
  }

  confirmarEliminacion() {
    if (!this.planAEliminar) return;
    this.planService.eliminarPlan(this.planAEliminar).subscribe({
      next: () => {
        this.alertService.success('Plan eliminado correctamente');
        this.cargarPlanes();
      },
      error: () => this.alertService.error('Error al eliminar el plan'),
    });
    this.cerrarModal();
  }

  cerrarModal() {
    this.showConfirmModal = false;
    this.planAEliminar = null;
    this.planANombreEliminar = null;
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarPlanes();
  }
}

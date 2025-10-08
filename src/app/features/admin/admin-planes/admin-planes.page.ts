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
  templateUrl: './admin-planes.page.html',
  styleUrls: ['./admin-planes.page.scss'],
})
export class AdminPlanesPage {
  planNombreFn = (p: Plan) => p.nombre ?? null;
  descripcionFn = (p: Plan) => p.descripcion ?? null;
  precioFn = (p: Plan) => p.precioUfPorProyecto ?? null;
  maximoUsuariosFn = (p: Plan) => p.maximoUsuariosPorProyecto ?? null;
  planEstadoActivoFn = (p: Plan) => (typeof p.estadoActivo === 'boolean' ? p.estadoActivo : null);

  planForm: FormGroup;
  estadoActivoControl;
  planes: Plan[] = [];
  loading = false;
  showConfirmModal = false;
  modoEdicion = false;
  planEditandoId: string | null = null;
  planAEliminar: string | null = null;
  planANombreEliminar: string | null = null;
  filtroBusqueda = '';
  paginaActual = 1;
  totalPaginas = 1;
  totalRegistros = 0;

  readonly planService = inject(PlanService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  constructor() {
    this.estadoActivoControl = this.fb.control(true);
    this.planForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(200)]],
      precioUfPorProyecto: [0, [Validators.required, Validators.min(0)]],
      maximoUsuariosPorProyecto: [1, [Validators.required, Validators.min(1)]],
      estadoActivo: this.estadoActivoControl,
    });
    // Sincronizar el control de estadoActivo con el formulario
    this.estadoActivoControl.valueChanges.subscribe((valor) => {
      this.planForm.get('estadoActivo')?.setValue(valor, { emitEvent: false });
    });
    this.cargarPlanes();
  }

  cargarPlanes(): Promise<void> {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    return new Promise((resolve, reject) => {
      this.planService.listarPaginadoPlanes(filtro).subscribe({
        next: (resp) => {
          if (
            resp?.codigoRespuesta === 0 &&
            resp.respuesta &&
            Array.isArray(resp.respuesta.datos)
          ) {
            this.planes = resp.respuesta.datos;
            this.totalRegistros =
              typeof resp.respuesta.total === 'number' ? resp.respuesta.total : 0;
            this.totalPaginas = Math.ceil(this.totalRegistros / filtro.tamano);
          } else if (resp?.codigoRespuesta === 1) {
            this.planes = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.info?.(resp?.glosaRespuesta || 'No se encontraron planes.');
          } else {
            this.planes = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.error(resp?.glosaRespuesta || 'Error al cargar planes');
          }
          this.loading = false;
          resolve();
        },
        error: () => {
          this.loading = false;
          this.planes = [];
          this.totalRegistros = 0;
          this.totalPaginas = 1;
          this.alertService.error('Error al cargar planes');
          reject();
        },
      });
    });
  }

  buscarPlanes(): void {
    this.paginaActual = 1;
    this.cargarPlanes();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarPlanes();
  }

  async registrarPlan() {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      this.alertService.error('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }
    const plan: Plan = {
      ...this.planForm.value,
      estadoActivo: this.estadoActivoControl.value,
    };
    this.loading = true;
    this.planService.crearPlan(plan).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          await this.cargarPlanes();
          this.alertService.success(resp?.glosaRespuesta || 'Plan registrado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo registrar el plan.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al registrar plan');
        }
      },
      error: () => this.alertService.error('Error al registrar plan'),
      complete: () => (this.loading = false),
    });
  }

  editarPlan(plan: Plan): void {
    this.modoEdicion = true;
    this.planEditandoId = plan.id || null;
    this.planForm.patchValue({
      nombre: plan.nombre || '',
      descripcion: plan.descripcion || '',
      precioUfPorProyecto: plan.precioUfPorProyecto ?? 0,
      maximoUsuariosPorProyecto: plan.maximoUsuariosPorProyecto ?? 1,
      estadoActivo: plan.estadoActivo ?? true,
    });
    // Refuerza la sincronización del switch
    this.estadoActivoControl.setValue(plan.estadoActivo ?? true, { emitEvent: false });
    this.planForm.markAsPristine();
  }

  get hayCambios(): boolean {
    return this.modoEdicion && this.planForm.dirty;
  }

  async actualizarPlan() {
    if (!this.planEditandoId) return;
    if (this.planForm.get('nombre')?.invalid) {
      this.alertService.error('El nombre es requerido y debe tener entre 3 y 50 caracteres.');
      this.planForm.get('nombre')?.markAsTouched();
      return;
    }
    const plan: Plan = {
      ...this.planForm.value,
      id: this.planEditandoId,
      estadoActivo: this.estadoActivoControl.value,
    };
    this.loading = true;
    this.planService.modificarPlan(plan).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          await this.cargarPlanes();
          this.alertService.success(resp?.glosaRespuesta || 'Plan actualizado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo actualizar el plan.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al actualizar plan');
        }
      },
      error: () => this.alertService.error('Error al actualizar plan'),
      complete: () => (this.loading = false),
    });
  }

  limpiarFormulario(): void {
    this.planForm.reset({
      nombre: '',
      descripcion: '',
      precioUfPorProyecto: 0,
      maximoUsuariosPorProyecto: 1,
      estadoActivo: true,
    });
    this.estadoActivoControl.setValue(true, { emitEvent: false });
    this.modoEdicion = false;
    this.planEditandoId = null;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  eliminarPlan(plan: Plan): void {
    if (!plan || !plan.id) {
      this.alertService.error('No se pudo identificar el plan a eliminar.');
      return;
    }
    this.planAEliminar = plan.id;
    this.planANombreEliminar = plan.nombre ?? null;
    this.showConfirmModal = true;
  }

  async confirmarEliminacion() {
    if (!this.planAEliminar) return;
    this.loading = true;
    this.planService.eliminarPlan(this.planAEliminar).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.cerrarModal();
          await this.cargarPlanes();
          this.alertService.success(resp?.glosaRespuesta || 'Plan eliminado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo eliminar el plan.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al eliminar plan');
        }
      },
      error: () => this.alertService.error('Error al eliminar plan'),
      complete: () => (this.loading = false),
    });
  }

  cerrarModal(): void {
    this.showConfirmModal = false;
    this.planAEliminar = null;
    this.planANombreEliminar = null;
  }
}

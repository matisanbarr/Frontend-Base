import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { RouterModule } from '@angular/router';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { AlertService } from '../../../core/services/alert.service';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { TenantService } from '../../../core/services/tenant.service';
import { Proyecto } from '../../../models/proyecto.model';
import { Tenant } from '../../../models/tenant.model';
import { AsignarProyectosTenant, TenantConProyecto } from '../../../models/asignar-proyectos-tenant.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../../models/compartidos/respuestaPaginadaDto.model';

@Component({
  selector: 'app-admin-asignacion-proyectos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToastAlertsComponent, FormsModule],
  templateUrl: './admin-asignacion-proyectos.component.html',
  styleUrls: ['./admin-asignacion-proyectos.component.scss']
})
export class AdminAsignacionProyectosComponent {
  readonly alertService = inject(AlertService);
  readonly proyectoService = inject(ProyectoService);
  readonly tenantService = inject(TenantService);
  readonly fb = inject(FormBuilder);

  asignacionForm: FormGroup;
  empresas: Tenant[] = [];
  proyectos: Proyecto[] = [];
  asignaciones: TenantConProyecto[] = [];
  totalAsignaciones: number = 0;
  proyectosSeleccionados: string[] = [];
  loading = false;
  showConfirmModal = false;
  empresaIdAEliminar: string | null = null;
  empresaNombreAEliminar: string | null = null;
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;

  // No hay edición

  constructor() {
    this.asignacionForm = this.fb.group({
      empresaId: ['', Validators.required]
    });
    this.cargarEmpresas();
    this.cargarProyectos();
  this.cargarAsignaciones();
  }

  cargarEmpresas() {
    this.tenantService.listarTenants().subscribe((empresas: Tenant[]) => {
      this.empresas = empresas;
    });
  }

  cargarProyectos() {
    this.proyectoService.listarProyectos().subscribe((proyectos: Proyecto[]) => {
      this.proyectos = proyectos;
    });
  }

  cargarAsignaciones() {
    this.loading = true;
    const paginacion: PaginacionDto = {
      pagina: this.paginaActual,
      tamano: 10,
      filtro: this.filtroBusqueda,
      descendente: false
    };
    this.proyectoService.listarAsignacionesProyectosPaginado(paginacion).subscribe({
      next: (resp: RespuestaPaginadaDto) => {
        this.asignaciones = resp.datos;
        this.totalAsignaciones = resp.total;
        this.totalPaginas = Math.ceil(resp.total / 10);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error al cargar asignaciones');
      }
    });
  }

  buscarAsignaciones() {
    this.paginaActual = 1;
    this.cargarAsignaciones();
  }

  onProyectoCheck(event: any, proyectoId: string) {
    if (event.target.checked) {
      if (!this.proyectosSeleccionados.includes(proyectoId)) {
        this.proyectosSeleccionados.push(proyectoId);
      }
    } else {
      this.proyectosSeleccionados = this.proyectosSeleccionados.filter(id => id !== proyectoId);
    }
  }

  guardarAsignacion() {
    if (this.asignacionForm.invalid || this.proyectosSeleccionados.length === 0) return;
    const payload: AsignarProyectosTenant = {
      tenantId: this.asignacionForm.value.empresaId,
      proyectoIds: this.proyectosSeleccionados
    };
    this.loading = true;
    this.proyectoService.agregarAUnTenant(payload).subscribe({
      next: () => {
        this.cargarAsignaciones();
        this.asignacionForm.reset();
        this.proyectosSeleccionados = [];
        this.alertService.success('Asignación guardada correctamente');
        this.loading = false;
      },
      error: () => {
        this.alertService.error('Error al guardar la asignación');
        this.loading = false;
      }
    });
  }

  // No hay edición ni cancelación

  proyectosAEliminar: Proyecto[] = [];

  eliminarAsignacion(asignacion: TenantConProyecto) {
    this.empresaIdAEliminar = asignacion.tenantId;
    this.empresaNombreAEliminar = asignacion.tenantNombre;
    this.proyectosAEliminar = asignacion.proyectos;
    if (asignacion.proyectos.length === 1) {
      this.asignacionAEliminarProyectoId = asignacion.proyectos[0].id || null;
      this.showConfirmModal = true;
    } else {
      // Si hay más de un proyecto, se muestra el modal y se espera selección del usuario
      this.asignacionAEliminarProyectoId = null;
      this.showConfirmModal = true;
    }
  }

  seleccionarProyectoAEliminar(proyectoId: string) {
    this.asignacionAEliminarProyectoId = proyectoId;
  }

  confirmarEliminacion() {
    debugger
    if (!this.empresaIdAEliminar || !this.asignacionAEliminarProyectoId) return;
    this.loading = true;
    this.proyectoService.eliminarAsignacionProyecto(this.empresaIdAEliminar, this.asignacionAEliminarProyectoId).subscribe({
      next: () => {
        this.cargarAsignaciones();
        this.alertService.success('Asignación eliminada correctamente');
        this.loading = false;
      },
      error: () => {
        this.alertService.error('Error al eliminar la asignación');
        this.loading = false;
      }
    });
    this.showConfirmModal = false;
  }

  asignacionAEliminarProyectoId: string | null = null;

  cerrarModal() {
    this.showConfirmModal = false;
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarAsignaciones();
  }
}

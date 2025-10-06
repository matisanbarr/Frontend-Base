import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TenantProyectoPlan } from '../../../../../models/tenantProyectoPlan.model';
import { TenantProyectoPlanService } from '../../../../../core/services/tenant-proyecto-plan.service';
import { PaginacionDto } from '../../../../../models';
import { ConfirmModalComponent } from '../../../../../shared/components/confirm-modal/confirm-modal.component';
import { AlertService } from '../../../../../core/services';
import { PagoTenantProyectoPlanFormComponent } from '../../components/pagos-tenants-proyectos-planes-form/pagos-tenants-proyectos-planes-form.component';

@Component({
  selector: 'app-tenant-proyecto-plan-list',
  standalone: true,
  templateUrl: './pago-tenant-proyecto-plan-list.component.html',
  styleUrls: ['./pago-tenant-proyecto-plan-list.component.scss'],
  imports: [CommonModule, DatePipe, ConfirmModalComponent, PagoTenantProyectoPlanFormComponent],
})
export class PagoTenantProyectoPlanListComponent implements OnInit {
  @Output() edit = new EventEmitter<TenantProyectoPlan>();
  asignaciones: TenantProyectoPlan[] = [];
  total = 0;
  pagina = 1;
  tamano = 10;
  totalPaginas = 1;
  loading = false;

  // Para eliminar
  showDeleteModal = false;
  deleteTarget: TenantProyectoPlan | null = null;

  // Para editar/crear
  editData: TenantProyectoPlan | null = null;
  formKey = 0; // Para forzar reinicio del form

  private readonly tenantProyectoPlanService = inject(TenantProyectoPlanService);
  private readonly alertService = inject(AlertService);

  constructor() {}

  ngOnInit() {
    this.getAsignaciones();
  }

  getAsignaciones() {
    this.loading = true;
    const paginacion = new PaginacionDto({ pagina: this.pagina, tamano: this.tamano });
    this.tenantProyectoPlanService.listarPaginadoTenantsProyectosPlanes(paginacion).subscribe({
      next: (resp) => {
        if (resp.codigoRespuesta == 0) {
          this.alertService.success(resp.glosaRespuesta || 'Operación exitosa');
          this.asignaciones = resp.respuesta?.datos || [];
          this.total = resp.respuesta?.total || 0;
          this.totalPaginas = Math.ceil(this.total / this.tamano) || 1;
          this.loading = false;
        } else if (resp.codigoRespuesta == 1) {
          this.alertService.success(resp.glosaRespuesta || 'No hay informacion');
          this.asignaciones = [];
          this.total = 0;
          this.totalPaginas = 1;
          this.loading = false;
        } else {
          this.alertService.warning(resp.glosaRespuesta || 'Error');
          this.asignaciones = [];
          this.total = 0;
          this.totalPaginas = 1;
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.asignaciones = [];
        this.total = 0;
        this.totalPaginas = 1;
      },
    });
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.pagina = pagina;
    this.getAsignaciones();
  }

  onEdit(asignacion: TenantProyectoPlan) {
    this.edit.emit({
      ...asignacion,
    } as any);
  }

  onSave(_data: TenantProyectoPlan) {
    this.editData = null;
    this.formKey++;
    this.getAsignaciones();
  }

  onConfirmDelete(asignacion: TenantProyectoPlan) {
    this.deleteTarget = asignacion;
    this.showDeleteModal = true;
  }

  onDelete() {
    this.loading = true;
    if (!this.deleteTarget?.id) {
      this.loading = false;
      return;
    }
    this.tenantProyectoPlanService.eliminarTenantProyectoPlane(this.deleteTarget.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.deleteTarget = null;
        this.getAsignaciones();
      },
      error: () => {
        this.showDeleteModal = false;
        this.deleteTarget = null;
        alert('Error al eliminar.');
      },
    });
  }
}

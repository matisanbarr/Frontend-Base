import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TenantProyectoPlan } from '../../../../../models/tenantProyectoPlan.model';
import { TenantProyectoPlanService } from '../../../../../core/services/tenant-proyecto-plan.service';
import { PaginacionDto } from '../../../../../models';

@Component({
  selector: 'app-tenant-proyecto-plan-list',
  standalone: true,
  templateUrl: './tenant-proyecto-plan-list.component.html',
  styleUrls: ['./tenant-proyecto-plan-list.component.scss'],
  imports: [CommonModule, DatePipe],
})
export class TenantProyectoPlanListComponent implements OnInit {
  asignaciones: TenantProyectoPlan[] = [];
  total = 0;
  pagina = 1;
  tamano = 10;
  loading = false;

  private readonly tenantProyectoPlanService = inject(TenantProyectoPlanService);

  constructor() {}

  ngOnInit() {
    this.getAsignaciones();
  }

  getAsignaciones() {
    this.loading = true;
    const paginacion = new PaginacionDto({ pagina: this.pagina, tamano: this.tamano });
    this.tenantProyectoPlanService.listarPaginadoTenantsProyectosPlanes(paginacion).subscribe({
      next: (resp) => {
        this.asignaciones = resp.respuesta?.datos || [];
        this.total = resp.respuesta?.total || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(nuevaPagina: number) {
    this.pagina = nuevaPagina;
    this.getAsignaciones();
  }
}

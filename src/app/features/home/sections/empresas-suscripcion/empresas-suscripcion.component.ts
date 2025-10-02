import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TenantPlanService } from '../../../../core/services/tenant-plan.service';
import { TenantPlan } from '../../../../models/asignacion-plan.model';

@Component({
  selector: 'app-empresas-suscripcion',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './empresas-suscripcion.component.html',
  styleUrls: ['./empresas-suscripcion.component.scss'],
})
export class EmpresasSuscripcionComponent implements OnInit {
  tenantPlanes: TenantPlan[] = [];
  loading = false;
  error: string | null = null;
  private tenantPlanService = inject(TenantPlanService);

  ngOnInit(): void {
    this.cargarPlanesPorVencer();
  }

  cargarPlanesPorVencer(dias: number = 7): void {
    this.loading = true;
    this.error = null;
    this.tenantPlanService.listarPlanesPorVencer(dias).subscribe({
      next: (planes: TenantPlan[]) => {
        this.tenantPlanes = planes;
        this.loading = false;
      },
      error: (_err: unknown) => {
        this.error = 'No se pudieron cargar los vencimientos.';
        this.loading = false;
      },
    });
  }

  diasRestantes(fechaFin: string | Date | undefined): number | null {
    if (!fechaFin) return null;
    const hoy = new Date();
    const fin = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin;
    const diff = fin.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

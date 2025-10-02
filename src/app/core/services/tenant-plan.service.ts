import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { TenantPlan } from '../../models/asignacion-plan.model';

@Injectable({ providedIn: 'root' })
export class TenantPlanService {
  private apiUrl = environment.apiUrl + '/tenantPlanes';

  constructor(private http: HttpClient) {}

  asignarPlan(tenantPlan: TenantPlan): Observable<any> {
    return this.http.post(this.apiUrl, tenantPlan);
  }

  modificarTenantPlan(tenantPlan: TenantPlan): Observable<any> {
    return this.http.put(this.apiUrl, tenantPlan);
  }

  listarTenantsPlanes(): Observable<TenantPlan[]> {
    return this.http.get<TenantPlan[]>(this.apiUrl);
  }

  eliminarTenantPlan(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarPaginadoTenantsPlanes(paginacion: PaginacionDto): Observable<RespuestaPaginadaDto> {
    return this.http.get<RespuestaPaginadaDto>(this.apiUrl + '/lista-paginada', {
      params: paginacion as any,
    });
  }

  listarPlanesPorVencer(dias: number): Observable<TenantPlan[]> {
    return this.http.get<TenantPlan[]>(this.apiUrl + '/planes-por-vencer', {
      params: { dias } as any,
    });
  }
}

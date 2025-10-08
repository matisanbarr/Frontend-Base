import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginada } from '../../models/compartidos';
import { Respuesta } from '../../models/compartidos/respuesta.model';
import { TenantProyectoPlan } from '../../models/tenantProyectoPlan.model';

@Injectable({ providedIn: 'root' })
export class TenantProyectoPlanService {
  private apiUrl = environment.apiUrl + '/tenantsProyectosPlanes';

  constructor(private http: HttpClient) {}

  crearTenantProyectoPlan(tenant: TenantProyectoPlan): Observable<Respuesta<boolean>> {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, tenant);
  }

  modificarTenantProyectoPlan(tenant: TenantProyectoPlan): Observable<Respuesta<boolean>> {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, tenant);
  }

  listarTenantsProyectosPlanes(): Observable<Respuesta<TenantProyectoPlan[]>> {
    return this.http.get<Respuesta<TenantProyectoPlan[]>>(this.apiUrl + '/listar-todo');
  }

  eliminarTenantProyectoPlane(id: string): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoTenantsProyectosPlanes(
    paginacion: PaginacionDto
  ): Observable<Respuesta<RespuestaPaginada>> {
    return this.http.get<Respuesta<RespuestaPaginada>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

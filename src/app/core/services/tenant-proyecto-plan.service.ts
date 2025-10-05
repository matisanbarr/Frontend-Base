import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { Respuesta } from '../../models/compartidos/respuesta.model';
import { TenantProyectoPlan } from '../../models/tenantProyectoPlan.model';

@Injectable({ providedIn: 'root' })
export class TenantProyectoPlanService {
  private apiUrl = environment.apiUrl + '/tenantsProyectosPlanes';

  constructor(private http: HttpClient) {}

  crearTenantProyectoPlan(tenant: TenantProyectoPlan): Observable<Respuesta<any>> {
    return this.http.post<Respuesta<any>>(this.apiUrl, tenant);
  }

  modificarTenantProyectoPlan(tenant: TenantProyectoPlan): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(this.apiUrl, tenant);
  }

  listarTenantsProyectosPlanes(): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl + '/listar-todo');
  }

  eliminarTenantProyectoPlane(id: string): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoTenantsProyectosPlanes(
    paginacion: PaginacionDto
  ): Observable<Respuesta<RespuestaPaginadaDto>> {
    return this.http.get<Respuesta<RespuestaPaginadaDto>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

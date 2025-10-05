import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { Respuesta } from '../../models/compartidos/respuesta.model';
import { TenantProyectoPlan } from '../../models/tenantProyectoPlan.model';
import { HistorialTenantProyectoPlan } from '../../models/historialTenantProyectoPlan.model';

@Injectable({ providedIn: 'root' })
export class HistorialTenantProyectoPlanService {
  private apiUrl = environment.apiUrl + '/historialTenantsProyectosPlanes';

  constructor(private http: HttpClient) {}

  crearHistorialTenantProyectoPlan(
    historial: HistorialTenantProyectoPlan
  ): Observable<Respuesta<any>> {
    return this.http.post<Respuesta<any>>(this.apiUrl, historial);
  }

  modificarHistorialTenantProyectoPlan(
    historial: HistorialTenantProyectoPlan
  ): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(this.apiUrl, historial);
  }

  listarHistorialTenantsProyectosPlanes(): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl + '/listar-todo');
  }

  eliminarHistorialTenantProyectoPlan(id: string): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoHistorialTenantsProyectosPlanes(
    paginacion: PaginacionDto
  ): Observable<Respuesta<RespuestaPaginadaDto>> {
    return this.http.get<Respuesta<RespuestaPaginadaDto>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

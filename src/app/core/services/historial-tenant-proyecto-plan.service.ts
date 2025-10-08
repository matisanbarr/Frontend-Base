import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginada } from '../../models/compartidos';
import { Respuesta } from '../../models/compartidos/respuesta.model';
import { HistorialTenantProyectoPlan } from '../../models/historialTenantProyectoPlan.model';

@Injectable({ providedIn: 'root' })
export class HistorialTenantProyectoPlanService {
  private apiUrl = environment.apiUrl + '/historialTenantsProyectosPlanes';

  constructor(private http: HttpClient) {}

  crearHistorialTenantProyectoPlan(
    historial: HistorialTenantProyectoPlan
  ): Observable<Respuesta<boolean>> {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, historial);
  }

  modificarHistorialTenantProyectoPlan(
    historial: HistorialTenantProyectoPlan
  ): Observable<Respuesta<boolean>> {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, historial);
  }

  listarHistorialTenantsProyectosPlanes(): Observable<Respuesta<HistorialTenantProyectoPlan[]>> {
    return this.http.get<Respuesta<HistorialTenantProyectoPlan[]>>(this.apiUrl + '/listar-todo');
  }

  eliminarHistorialTenantProyectoPlan(id: string): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoHistorialTenantsProyectosPlanes(
    paginacion: PaginacionDto
  ): Observable<Respuesta<RespuestaPaginada>> {
    return this.http.get<Respuesta<RespuestaPaginada>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

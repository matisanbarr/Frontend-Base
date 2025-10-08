import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginada } from '../../models/compartidos';
import { Respuesta } from '../../models/compartidos/respuesta.model';
import { TenantProyectoPlan } from '../../models/tenantProyectoPlan.model';
import { HistorialTenantProyectoPlan } from '../../models/historialTenantProyectoPlan.model';
import { PagoTenantProyectoPlan } from '../../models/pagoTenantProyectoPlan.model';

@Injectable({ providedIn: 'root' })
export class PagoTenantProyectoPlanService {
  private apiUrl = environment.apiUrl + '/pagosTenantsProyectosPlanes';

  constructor(private http: HttpClient) {}

  crearPagoTenantProyectoPlan(pago: PagoTenantProyectoPlan): Observable<Respuesta<boolean>> {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, pago);
  }

  modificarPagoTenantProyectoPlan(pago: PagoTenantProyectoPlan): Observable<Respuesta<boolean>> {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, pago);
  }

  listarPagoTenantsProyectosPlanes(): Observable<Respuesta<PagoTenantProyectoPlan>> {
    return this.http.get<Respuesta<PagoTenantProyectoPlan>>(this.apiUrl + '/listar-todo');
  }

  eliminarPagoTenantProyectoPlan(id: string): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoPagoTenantsProyectosPlanes(
    paginacion: PaginacionDto
  ): Observable<Respuesta<RespuestaPaginada>> {
    return this.http.get<Respuesta<RespuestaPaginada>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { Respuesta } from '../../models/compartidos/respuesta.model';
import { TenantProyectoPlan } from '../../models/tenantProyectoPlan.model';
import { HistorialTenantProyectoPlan } from '../../models/historialTenantProyectoPlan.model';
import { PagoTenantProyectoPlan } from '../../models/pagoTenantProyectoPlan.model';

@Injectable({ providedIn: 'root' })
export class PagoTenantProyectoPlanService {
  private apiUrl = environment.apiUrl + '/pagoTenantsProyectosPlanes';

  constructor(private http: HttpClient) {}

  crearPagoTenantProyectoPlan(pago: PagoTenantProyectoPlan): Observable<Respuesta<any>> {
    return this.http.post<Respuesta<any>>(this.apiUrl, pago);
  }

  modificarPagoTenantProyectoPlan(pago: PagoTenantProyectoPlan): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(this.apiUrl, pago);
  }

  listarPagoTenantsProyectosPlanes(): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl + '/listar-todo');
  }

  eliminarPagoTenantProyectoPlan(id: string): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoPagoTenantsProyectosPlanes(
    paginacion: PaginacionDto
  ): Observable<Respuesta<RespuestaPaginadaDto>> {
    return this.http.get<Respuesta<RespuestaPaginadaDto>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

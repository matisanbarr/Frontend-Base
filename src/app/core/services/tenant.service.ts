import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { Tenant } from '../../models/tenant.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private apiUrl = environment.apiUrl + '/tenants';

  constructor(private http: HttpClient) {}

  crearTenant(tenant: Tenant): Observable<Respuesta<any>> {
    return this.http.post<Respuesta<any>>(this.apiUrl, tenant);
  }

  modificarTenant(tenant: Tenant): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(this.apiUrl, tenant);
  }

  listarTenants(): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl + '/listar-todo');
  }

  eliminarTenant(id: string): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoTenants(paginacion: PaginacionDto): Observable<Respuesta<RespuestaPaginadaDto>> {
    return this.http.get<Respuesta<RespuestaPaginadaDto>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

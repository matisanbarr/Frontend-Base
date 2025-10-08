import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginada } from '../../models/compartidos';
import { Tenant } from '../../models/tenant.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private apiUrl = environment.apiUrl + '/tenants';

  constructor(private http: HttpClient) {}

  crearTenant(tenant: Tenant): Observable<Respuesta<boolean>> {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, tenant);
  }

  modificarTenant(tenant: Tenant): Observable<Respuesta<boolean>> {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, tenant);
  }

  listarTenants(): Observable<Respuesta<Tenant[]>> {
    return this.http.get<Respuesta<Tenant[]>>(this.apiUrl + '/listar-todo');
  }

  eliminarTenant(id: string): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoTenants(paginacion: PaginacionDto): Observable<Respuesta<RespuestaPaginada>> {
    return this.http.get<Respuesta<RespuestaPaginada>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

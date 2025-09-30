import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { Tenant } from '../../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = environment.apiUrl + '/tenants';

  constructor(private http: HttpClient) {}

  crearTenant(tenant: Tenant): Observable<any> {
    return this.http.post(this.apiUrl, tenant);
  }

  modificarTenant(tenant: Tenant): Observable<any> {
    return this.http.put(this.apiUrl, tenant);
  }

  listarTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.apiUrl);
  }         

  eliminarTenant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarPaginadoTenants(paginacion: PaginacionDto): Observable<RespuestaPaginadaDto> {
    return this.http.get<RespuestaPaginadaDto>(this.apiUrl + '/lista-paginada', { params: paginacion as any });
  }
}

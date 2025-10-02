import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { TenantPlan } from '../../models/asignacion-plan.model';
import { Proyecto } from '../../models/proyecto.model';
import { AsignarProyectosTenant } from '../../models/asignar-proyectos-tenant.model';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private apiUrl = environment.apiUrl + '/proyectos';

  constructor(private http: HttpClient) {}

  crearProyecto(proyecto: Proyecto): Observable<any> {
    return this.http.post(this.apiUrl, proyecto);
  }

  modificarProyecto(proyecto: Proyecto): Observable<any> {
    return this.http.put(this.apiUrl, proyecto);
  }

  listarProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.apiUrl);
  }

  eliminarProyecto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarPaginadoProyectos(paginacion: PaginacionDto): Observable<RespuestaPaginadaDto> {
    return this.http.get<RespuestaPaginadaDto>(this.apiUrl + '/lista-paginada', {
      params: paginacion as any,
    });
  }

  agregarAUnTenant(asignarProyectoTenant: AsignarProyectosTenant): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/asignar-a-tenant', asignarProyectoTenant);
  }

  listarAsignacionesProyectosPaginado(paginacion: PaginacionDto): Observable<RespuestaPaginadaDto> {
    return this.http.get<RespuestaPaginadaDto>(this.apiUrl + '/asignaciones-paginadas', {
      params: paginacion as any,
    });
  }

  eliminarAsignacionProyecto(tenantId: string, proyectoId: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/asignacion', {
      params: { tenantId, proyectoId },
    });
  }
}

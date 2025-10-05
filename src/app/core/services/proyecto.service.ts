import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { TenantPlan } from '../../models/asignacion-plan.model';
import { Proyecto } from '../../models/proyecto.model';
import { AsignarProyectosTenant } from '../../models/asignar-proyectos-tenant.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private apiUrl = environment.apiUrl + '/proyectos';

  constructor(private http: HttpClient) {}

  crearProyecto(proyecto: Proyecto): Observable<Respuesta<any>> {
    return this.http.post<Respuesta<any>>(this.apiUrl, proyecto);
  }

  modificarProyecto(proyecto: Proyecto): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(this.apiUrl, proyecto);
  }

  listarProyectos(): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl + '/listar-todos');
  }

  eliminarProyecto(id: string): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.apiUrl}/${id}`);
  }

  listarPaginadoProyectos(paginacion: PaginacionDto): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

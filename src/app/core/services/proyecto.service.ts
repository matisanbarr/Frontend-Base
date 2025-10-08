import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginada } from '../../models/compartidos';
import { Proyecto } from '../../models/proyecto.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private apiUrl = environment.apiUrl + '/proyectos';

  constructor(private http: HttpClient) {}

  crearProyecto(proyecto: Proyecto): Observable<Respuesta<boolean>> {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, proyecto);
  }

  modificarProyecto(proyecto: Proyecto): Observable<Respuesta<boolean>> {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, proyecto);
  }

  listarProyectos(): Observable<Respuesta<Proyecto[]>> {
    return this.http.get<Respuesta<Proyecto[]>>(this.apiUrl + '/listar-todo');
  }

  eliminarProyecto(id: string): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(`${this.apiUrl}/${id}`);
  }

  listarPaginadoProyectos(paginacion: PaginacionDto): Observable<Respuesta<RespuestaPaginada>> {
    return this.http.get<Respuesta<RespuestaPaginada>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

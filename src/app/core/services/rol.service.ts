import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rol } from '../../models/rol.model';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginada } from '../../models/compartidos';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = environment.apiUrl + '/roles';

  constructor(private http: HttpClient) {}

  crearRol(rol: Rol): Observable<Respuesta<boolean>> {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, rol);
  }

  modificarRol(rol: Rol): Observable<Respuesta<boolean>> {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, rol);
  }

  listarRoles(): Observable<Respuesta<Rol[]>> {
    return this.http.get<Respuesta<Rol[]>>(this.apiUrl + '/listar-todo');
  }

  eliminarRol(id: string): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(this.apiUrl + `/${id}`);
  }

  listarPaginadoRoles(paginacion: PaginacionDto): Observable<Respuesta<RespuestaPaginada>> {
    return this.http.get<Respuesta<RespuestaPaginada>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

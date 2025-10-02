import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { AsignarRolesDto } from '../../models/asignarRoles.model';
import { Usuario } from '../../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  registro(usuario: Usuario): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, usuario).pipe(
      catchError((error) => {
        console.error('Error en registro:', error);
        throw error;
      })
    );
  }

  modificar(userData: Usuario): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${userData.id}`, userData).pipe(
      catchError((error) => {
        console.error('Error en modificar usuario:', error);
        throw error;
      })
    );
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarPaginadoUsuarios(paginacion: PaginacionDto): Observable<RespuestaPaginadaDto> {
    return this.http.get<RespuestaPaginadaDto>(this.apiUrl + '/lista-paginada', {
      params: paginacion as any,
    });
  }

  asignarRoles(userData: AsignarRolesDto): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + '/asignar-roles', userData).pipe(
      catchError((error) => {
        console.error('Error en asignar roles:', error);
        throw error;
      })
    );
  }

  aquitarRoles(userData: AsignarRolesDto): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + '/quitar-roles', userData).pipe(
      catchError((error) => {
        console.error('Error en quitar roles:', error);
        throw error;
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { AsignarRolesDto } from '../../models/asignarRoles.model';
import { Usuario } from '../../models/usuario.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  registro(usuario: Usuario): Observable<Respuesta<any>> {
    return this.http.post<Respuesta<any>>(this.apiUrl, usuario).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  modificar(usuario: Usuario): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(this.apiUrl, usuario).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  listarUsuarios(): Observable<Respuesta<any>[]> {
    return this.http.get<Respuesta<any>[]>(this.apiUrl + 'listar-todos');
  }

  eliminarUsuario(id: string): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.apiUrl}/${id}`);
  }

  listarPaginadoUsuarios(paginacion: PaginacionDto): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl, {
      params: paginacion as any,
    });
  }

  proximosCumpleaños(dias: number): Observable<Respuesta<any>> {
    return this.http
      .get<Respuesta<any>>(this.apiUrl + '/cumpleanios-proximos', {
        params: { dias: dias.toString() },
      })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}

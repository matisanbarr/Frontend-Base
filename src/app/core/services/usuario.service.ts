import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rol } from '../../models/rol.model';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { RegisterRequest, User } from '../../models';
import { AsignarRolesDto } from '../../models/asignarRoles.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  registro(userData: RegisterRequest): Observable<boolean> {
			return this.http.post<boolean>(this.apiUrl, userData).pipe(
			catchError(error => {
				console.error('Error en registro:', error);
				throw error;
			})
		);
	}

  modificar(userData: User): Observable<User> {
			return this.http.put<User>(`${this.apiUrl}/${userData.id}`, userData).pipe(
			catchError(error => {
				console.error('Error en modificar usuario:', error);
				throw error;
			})
		);
	}

  listarUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  eliminarUsuario(nombre: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${nombre}`);
  }

  listarPaginadoUsuarios(paginacion: PaginacionDto): Observable<RespuestaPaginadaDto> {
    return this.http.get<RespuestaPaginadaDto>(this.apiUrl + '/lista-paginada', { params: paginacion as any });
  }

  asignarRoles(userData: AsignarRolesDto): Observable<boolean> {
			return this.http.post<boolean>(this.apiUrl + '/asignar-roles', userData).pipe(
			catchError(error => {
				console.error('Error en asignar roles:', error);
				throw error;
			})
		);
	}

  aquitarRoles(userData: AsignarRolesDto): Observable<boolean> {
			return this.http.post<boolean>(this.apiUrl + '/quitar-roles', userData).pipe(
			catchError(error => {
				console.error('Error en quitar roles:', error);
				throw error;
			})
		);
	}
}

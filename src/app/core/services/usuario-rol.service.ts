import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActualizarUsuarioRoles } from '../../models/usuario-rol.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';
import { UsuarioRoleResponse } from '../../models';

@Injectable({ providedIn: 'root' })
export class UsuarioRolService {
  private apiUrl = environment.apiUrl + '/usuariosRoles';

  constructor(private http: HttpClient) {}

  actualizarRolesUsuario(dto: ActualizarUsuarioRoles): Observable<Respuesta<UsuarioRoleResponse>> {
    return this.http.put<Respuesta<UsuarioRoleResponse>>(this.apiUrl + `/${dto.usuarioId}`, dto);
  }
}

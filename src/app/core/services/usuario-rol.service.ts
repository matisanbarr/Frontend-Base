import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActualizarUsuarioRoles } from '../../models/usuario-rol.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class UsuarioRolService {
  private apiUrl = environment.apiUrl + '/usuariosRoles';

  constructor(private http: HttpClient) {}

  actualizarRolesUsuario(dto: ActualizarUsuarioRoles): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(this.apiUrl + `/${dto.usuarioId}`, dto);
  }
}

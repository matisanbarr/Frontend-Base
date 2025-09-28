import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Role, CreateRoleRequest, UsuarioRoleRequest, UsuarioRoleResponse } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private apiService: ApiService) {}

  /**
   * Obtener todos los roles
   */
  getRoles(): Observable<Role[]> {
    return this.apiService.get<Role[]>('/roles');
  }

  /**
   * Obtener rol por ID
   */
  getRoleById(id: string): Observable<Role> {
    return this.apiService.get<Role>(`/roles/${id}`);
  }

  /**
   * Crear nuevo rol
   */
  createRole(roleData: CreateRoleRequest): Observable<Role> {
    return this.apiService.post<Role>('/roles', roleData);
  }

  /**
   * Actualizar rol
   */
  updateRole(id: string, roleData: Partial<CreateRoleRequest>): Observable<Role> {
    return this.apiService.put<Role>(`/roles/${id}`, roleData);
  }

  /**
   * Eliminar rol
   */
  deleteRole(id: string): Observable<void> {
    return this.apiService.delete<void>(`/roles/${id}`);
  }

  /**
   * Asignar rol a usuario
   */
  assignRoleToUser(assignment: UsuarioRoleRequest): Observable<UsuarioRoleResponse> {
    return this.apiService.post<UsuarioRoleResponse>('/usuarioroles', assignment);
  }

  /**
   * Remover rol de usuario
   */
  removeRoleFromUser(usuarioId: string, rolId: string): Observable<void> {
    return this.apiService.delete<void>(`/usuarioroles/${usuarioId}/${rolId}`);
  }

  /**
   * Obtener roles de un usuario específico
   */
  getUserRoles(usuarioId: string): Observable<Role[]> {
    return this.apiService.get<Role[]>(`/usuarios/${usuarioId}/roles`);
  }

  /**
   * Obtener usuarios con un rol específico
   */
  getUsersByRole(rolId: string): Observable<any[]> {
    return this.apiService.get<any[]>(`/roles/${rolId}/usuarios`);
  }
}
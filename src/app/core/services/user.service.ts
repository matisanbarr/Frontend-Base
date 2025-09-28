import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) {}

  /**
   * Obtener todos los usuarios
   */
  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/usuarios');
  }

  /**
   * Obtener usuario por ID
   */
  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`/usuarios/${id}`);
  }

  /**
   * Crear nuevo usuario
   */
  createUser(userData: { nombreUsuario: string; password: string }): Observable<User> {
    return this.apiService.post<User>('/usuarios', userData);
  }

  /**
   * Actualizar usuario
   */
  updateUser(id: string, userData: { nombreUsuario?: string; password?: string }): Observable<User> {
    return this.apiService.put<User>(`/usuarios/${id}`, userData);
  }

  /**
   * Eliminar usuario
   */
  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`/usuarios/${id}`);
  }

  /**
   * Obtener perfil del usuario actual
   */
  getCurrentUserProfile(): Observable<User> {
    return this.apiService.get<User>('/usuarios/profile');
  }
}
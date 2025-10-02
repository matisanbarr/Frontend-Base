import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpConfigService {
  constructor(private authService: AuthService) {}

  /**
   * Obtener headers completos para peticiones autenticadas
   */
  getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': environment.apiKey,
    });

    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Obtener headers solo con API Key (para endpoints públicos)
   */
  getPublicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': environment.apiKey,
    });
  }

  /**
   * Verificar si el endpoint requiere autenticación
   */
  requiresAuth(endpoint: string): boolean {
    const publicEndpoints = ['/auth/login', '/usuarios'];
    return !publicEndpoints.some((public_endpoint) => endpoint.includes(public_endpoint));
  }
}

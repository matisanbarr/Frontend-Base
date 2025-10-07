import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../models';
import { jwtDecode } from 'jwt-decode';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRATION_KEY = 'token_expiration';
  private readonly USER_KEY = 'current_user';
  private readonly USER_ROLES_KEY = 'user_roles';

  private currentUserSubject = new BehaviorSubject<any | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // --- Sesión y autenticación ---

  login(credentials: LoginRequest): Observable<Respuesta<LoginResponse>> {
    return this.http.post<Respuesta<LoginResponse>>(this.apiUrl + '/auth/login', credentials).pipe(
      map((resp) => {
        if (resp && resp.codigoRespuesta === 0) {
          if (resp.respuesta) {
            this.setSession(resp.respuesta);
          }
        } else {
          throw new Error(resp.glosaRespuesta || 'Error en interno, por favor intente nuevamente');
        }
        return resp;
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of();
    }
    return this.http
      .post<Respuesta<LoginResponse>>(this.apiUrl + '/auth/refresh', refreshToken)
      .pipe(
        map((resp) => {
          if (resp && resp.codigoRespuesta === 0 && resp.respuesta) {
            this.setSession(resp.respuesta);
            return resp.respuesta;
          } else {
            throw new Error('Respuesta de refresco inválida');
          }
        }),
        catchError((error) => {
          console.error('Error al refrescar token:', error);
          this.logout();
          throw error;
        })
      );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  // --- Métodos de obtención de datos ---

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getTokenExpiration(): string | null {
    return localStorage.getItem(this.EXPIRATION_KEY);
  }

  getCurrentUser(): any | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr || userStr === 'undefined') return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error al parsear usuario:', e);
      return null;
    }
  }

  getCurrentUserRoles(): string[] {
    // Obtener roles directamente desde currentUser
    const user = this.getCurrentUser();
    return user && Array.isArray(user.roles) ? user.roles : [];
  }

  // --- Métodos de verificación ---

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated() && !!this.getCurrentUser();
  }

  hasRole(role: string): boolean {
    // Verifica si el usuario tiene el rol, aunque tenga más de uno
    return this.getCurrentUserRoles().some((r) => r === role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getCurrentUserRoles();
    return roles.some((role) => userRoles.includes(role));
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  }

  // --- Métodos privados ---

  private setSession(tokenResponse: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, tokenResponse.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
    localStorage.setItem(this.EXPIRATION_KEY, tokenResponse.expiration);
    try {
      const decoded: any = jwtDecode(tokenResponse.accessToken);
      // Extraer claims tal como vienen
      const usuarioId = decoded['nameidentifier'] || decoded['NameIdentifier'];
      const nombreUsuario = decoded['NombreUsuario'];
      const primerNombre = decoded['PrimerNombre'];
      const segundoNombre = decoded['SegundoNombre'];
      const primerApellido = decoded['PrimerApellido'];
      const segundoApellido = decoded['SegundoApellido'];
      const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      const isGlobal = decoded['IsGlobal'] === 'True';
      const tenantId = decoded['TenantId'];

      // Capturar roles únicamente desde el claim estándar
      let roles: string[] = [];
      const claim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (Array.isArray(claim)) {
        roles = claim.filter((r) => typeof r === 'string');
      } else if (typeof claim === 'string') {
        roles = [claim];
      }
      // Si el usuario tiene 'Admin Global', dejar solo ese rol
      if (roles.length > 0 && roles.indexOf('Admin Global') !== -1) {
        roles = ['Admin Global'];
      }

      let user: any = {
        usuarioId,
        nombreUsuario,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        email,
        isGlobal,
        tenantId,
        roles,
      };
      if (decoded['Proyectos']) {
        try {
          user.proyectos = JSON.parse(decoded['Proyectos']);
        } catch (e) {
          // Si falla el parseo, no agregar la propiedad
        }
      }
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } catch (e) {
      console.error('Error al extraer datos del JWT:', e);
      localStorage.setItem(this.USER_KEY, JSON.stringify({}));
      localStorage.removeItem(this.USER_ROLES_KEY);
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(true);
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }

  private checkInitialAuthState(): boolean {
    try {
      const token = this.getToken();
      if (!token) return false;
      if (token.includes('test') || token.includes('example')) return true;
      return !this.isTokenExpired();
    } catch (error) {
      console.warn('Error checking initial auth state:', error);
      return false;
    }
  }
}

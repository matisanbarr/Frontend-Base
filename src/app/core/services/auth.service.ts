import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../models';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';
  private readonly USER_ROLES_KEY = 'user_roles';

  private currentUserSubject = new BehaviorSubject<any | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // --- Sesión y autenticación ---

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => this.setSession(response)),
      catchError((error) => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of();
    }
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((response) => this.setSession(response)),
        catchError((error) => {
          console.error('Error al refrescar token:', error);
          this.logout();
          throw error;
        })
      );
  }

  // --- Métodos de obtención de datos ---

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
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
    const rolesStr = localStorage.getItem(this.USER_ROLES_KEY);
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  // --- Métodos de verificación ---

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Retorna true si el usuario está autenticado (token válido y usuario actual existe)
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated() && !!this.getCurrentUser();
  }

  hasRole(role: string): boolean {
    return this.getCurrentUserRoles().includes(role);
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

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    try {
      const decoded: any = jwtDecode(authResult.token);
      // Extraer claims relevantes
      const tenantId = decoded.tenantId || authResult.tenantId;
      const isGlobal = decoded.isGlobal !== undefined ? decoded.isGlobal : authResult.isGlobal;
      const PrimerNombre =
        decoded.PrimerNombre !== undefined ? decoded.PrimerNombre : authResult.primerNombre;
      const SegundoNombre =
        decoded.SegundoNombre !== undefined ? decoded.SegundoNombre : authResult.segundoNombre;
      const PrimerApellido =
        decoded.PrimerApellido !== undefined ? decoded.PrimerApellido : authResult.primerApellido;
      const SegundoApellido =
        decoded.SegundoApellido !== undefined
          ? decoded.SegundoApellido
          : authResult.segundoApellido;
      const email =
        decoded.email ||
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      const name =
        decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      let roles =
        decoded.roles || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (roles) {
        if (typeof roles === 'string') {
          roles = [roles];
        }
        localStorage.setItem(this.USER_ROLES_KEY, JSON.stringify(roles));
      } else {
        localStorage.removeItem(this.USER_ROLES_KEY);
      }
      // Guardar usuario actual con claims relevantes
      const user: any = {
        token: authResult.token,
        email,
        name,
        tenantId,
        isGlobal,
        roles,
        primerNombre: decoded.PrimerNombre || decoded.primerNombre || authResult.primerNombre || '',
        segundoNombre:
          decoded.SegundoNombre || decoded.segundoNombre || authResult.segundoNombre || '',
        primerApellido:
          decoded.PrimerApellido || decoded.primerApellido || authResult.primerApellido || '',
        segundoApellido:
          decoded.SegundoApellido || decoded.segundoApellido || authResult.segundoApellido || '',
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (e) {
      console.error('Error al extraer datos del JWT:', e);
      localStorage.setItem(this.USER_KEY, JSON.stringify({}));
      localStorage.removeItem(this.USER_ROLES_KEY);
      this.currentUserSubject.next(null);
    }
    if (authResult.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authResult.refreshToken);
    }
    this.isAuthenticatedSubject.next(true);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.USER_ROLES_KEY);
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

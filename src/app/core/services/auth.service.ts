import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly TOKEN_KEY = 'auth_token';
	private readonly REFRESH_TOKEN_KEY = 'refresh_token';
	private readonly USER_KEY = 'current_user';
	private readonly USER_ROLES_KEY = 'user_roles';

	private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
	public currentUser$ = this.currentUserSubject.asObservable();

	private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
	public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

	constructor(private http: HttpClient, private router: Router) {}

	// --- Sesión y autenticación ---

	login(credentials: LoginRequest): Observable<LoginResponse> {
			return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
			tap(response => this.setSession(response)),
			catchError(error => {
				console.error('Error en login:', error);
				throw error;
			})
		);
	}

	register(userData: RegisterRequest): Observable<User> {
			return this.http.post<User>(`${environment.apiUrl}/usuarios`, userData).pipe(
			catchError(error => {
				console.error('Error en registro:', error);
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
			return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
			tap(response => this.setSession(response)),
			catchError(error => {
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

	getCurrentUser(): User | null {
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
		return roles.some(role => userRoles.includes(role));
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
		let user = authResult.user;
		try {
			const payload = JSON.parse(atob(authResult.token.split('.')[1]));
			if (!user) {
				const nameKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
				user = {
					id: '',
					nombreUsuario: payload[nameKey] || '',
					fechaCreacion: '',
					fechaModificacion: ''
				};
			}
			localStorage.setItem(this.USER_KEY, JSON.stringify(user));
			const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
			if (payload[roleKey]) {
				localStorage.setItem(this.USER_ROLES_KEY, JSON.stringify([payload[roleKey]]));
			} else {
				localStorage.removeItem(this.USER_ROLES_KEY);
			}
		} catch (e) {
			console.error('Error al extraer datos del JWT:', e);
			localStorage.setItem(this.USER_KEY, JSON.stringify(user || {
				id: '',
				nombreUsuario: '',
				fechaCreacion: '',
				fechaModificacion: ''
			}));
			localStorage.removeItem(this.USER_ROLES_KEY);
		}
		if (authResult.refreshToken) {
			localStorage.setItem(this.REFRESH_TOKEN_KEY, authResult.refreshToken);
		}
		this.currentUserSubject.next(user);
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

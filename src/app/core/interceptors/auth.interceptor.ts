import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Agregar API Key y JWT Token a todas las peticiones
  req = this.addAuthHeaders(req);
  // Log para verificar los headers
  console.log('Headers enviados:', req.headers.keys(), req.headers.get('x-api-key'));

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Agregar headers de autenticación (JWT + API Key)
   */
  private addAuthHeaders(request: HttpRequest<any>): HttpRequest<any> {
  let headers = request.headers.set('x-api-key', environment.apiKey);
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return request.clone({ headers });
  }

  /**
   * Manejar errores 401 (No autorizado)
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      
      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.token);
            
            // Reintentar la petición original con el nuevo token
            return next.handle(this.addAuthHeaders(request));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => error);
          })
        );
      } else {
        // No hay refresh token, cerrar sesión
        this.authService.logout();
        return throwError(() => new Error('No hay refresh token disponible'));
      }
    } else {
      // Si ya se está refrescando el token, esperar a que termine
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(this.addAuthHeaders(request)))
      );
    }
  }
}
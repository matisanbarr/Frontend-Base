import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Si no hay token, permitir que otros guards manejen la situación
    if (!this.authService.getToken()) {
      return true;
    }

    // Si el token no está expirado, continuar
    if (!this.authService.isTokenExpired()) {
      return true;
    }

    // Token expirado, intentar refrescar
    console.log('TokenGuard: Token expirado, intentando refrescar...');

    const refreshToken = this.authService.getRefreshToken();
    if (!refreshToken) {
      // No hay refresh token, cerrar sesión
      this.authService.logout();
      return false;
    }

    // Intentar refrescar el token
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        console.log('TokenGuard: Token refrescado exitosamente');
        return of(true);
      }),
      catchError((error) => {
        console.error('TokenGuard: Error al refrescar token', error);
        this.authService.logout();
        return of(false);
      })
    );
  }
}

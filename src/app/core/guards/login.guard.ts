import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Usuario ya está autenticado, redirigir al dashboard
          console.log('LoginGuard: Usuario ya autenticado, redirigiendo al dashboard');
          this.router.navigate(['/dashboard']);
          return false;
        } else {
          // Usuario no autenticado, permitir acceso al login
          return true;
        }
      })
    );
  }
}
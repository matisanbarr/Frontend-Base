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
    
    const token = this.authService.getToken();
    const isAuthenticated = !!token;
    
    if (isAuthenticated) {
      console.log('LoginGuard: Usuario ya autenticado, redirigiendo al dashboard');
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      console.log('LoginGuard: Usuario no autenticado, permitiendo acceso al login');
      return true;
    }
  }
}
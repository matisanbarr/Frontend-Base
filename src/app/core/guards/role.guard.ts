import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          // Usuario no autenticado, redirigir al login
          console.log('RoleGuard: Usuario no autenticado, redirigiendo al login');
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }

        // Obtener los roles requeridos de la configuración de la ruta
        const requiredRoles: string[] = route.data['roles'] || [];

        if (requiredRoles.length === 0) {
          // No se requieren roles específicos, permitir acceso
          return true;
        }

        // Verificar si el usuario tiene alguno de los roles requeridos
        const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);

        if (hasRequiredRole) {
          return true;
        } else {
          // Usuario no tiene los roles necesarios
          console.log('RoleGuard: Usuario sin permisos suficientes', {
            userRoles: this.authService.getCurrentUserRoles(),
            requiredRoles: requiredRoles,
          });

          // Redirigir a página de acceso denegado o dashboard
          this.router.navigate(['/access-denied']);
          return false;
        }
      })
    );
  }
}

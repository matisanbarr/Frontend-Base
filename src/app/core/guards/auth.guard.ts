import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  const isAuthenticated = !!token;

  if (isAuthenticated) {
    console.log('AuthGuard: Usuario autenticado, permitiendo acceso');
    return true;
  } else {
    console.log('AuthGuard: Usuario no autenticado, redirigiendo al login');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
};

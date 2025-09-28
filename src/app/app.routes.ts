import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard, LoginGuard, TokenGuard } from './core/guards';

export const routes: Routes = [
  // Ruta por defecto - redirigir al dashboard si está autenticado, sino al login
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Rutas de autenticación (públicas)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [LoginGuard] // No permitir acceso si ya está autenticado
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [LoginGuard] // No permitir acceso si ya está autenticado
      }
    ]
  },

  // Rutas protegidas (requieren autenticación)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [TokenGuard, AuthGuard]
  },

  // Rutas de administración (requieren rol admin)
  {
    path: 'admin',
    canActivate: [TokenGuard, AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'SuperAdmin'] }, // Roles requeridos
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/admin/roles/roles.component').then(m => m.RolesComponent)
      }
    ]
  },

  // Página de perfil (cualquier usuario autenticado)
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [TokenGuard, AuthGuard]
  },

  // Página de acceso denegado
  {
    path: 'access-denied',
    loadComponent: () => import('./shared/components/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },

  // Página 404
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

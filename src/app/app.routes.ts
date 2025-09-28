import { Routes } from '@angular/router';
import { AuthGuard, RoleGuard, LoginGuard, TokenGuard } from './core/guards';

export const routes: Routes = [
  // Ruta de testing
  {
    path: 'test',
    loadComponent: () => import('./test.component').then(m => m.TestComponent)
  },

  // Ruta por defecto - redirigir al login
  {
    path: '',
    redirectTo: '/auth/login',
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
        loadComponent: () => import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/admin/admin-roles/admin-roles.component').then(m => m.AdminRolesComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
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

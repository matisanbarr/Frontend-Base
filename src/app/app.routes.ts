import { Routes } from '@angular/router';
import { authGuard, RoleGuard, LoginGuard, TokenGuard } from './core/guards';

export const routes: Routes = [
  // Ruta de testing
  {
    path: 'test',
    loadComponent: () => import('./test.component').then((m) => m.TestComponent),
  },

  // Ruta por defecto - redirigir al login
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  // Rutas de autenticación (públicas)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.page').then((m) => m.LoginPage),
        canActivate: [LoginGuard], // No permitir acceso si ya está autenticado
      },
    ],
  },

  // Rutas protegidas (dashboard y sus hijos)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [TokenGuard, authGuard],
    children: [
      // Rutas de administración (requieren rol admin)
      {
        path: 'admin',
        canActivate: [RoleGuard],
        data: { roles: ['Admin Global', 'Usuario'] },
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./features/admin/admin-users/admin-users.page').then((m) => m.AdminUsersPage),
          },
          {
            path: 'roles',
            loadComponent: () =>
              import('./features/admin/admin-roles/admin-roles.page').then((m) => m.AdminRolesPage),
          },
          {
            path: 'planes',
            loadComponent: () =>
              import('./features/admin/admin-planes/admin-planes.page').then(
                (m) => m.AdminPlanesPage
              ),
          },
          {
            path: 'tenants',
            loadComponent: () =>
              import('./features/admin/admin-tenants/admin-tenants.page').then(
                (m) => m.AdminTenantsPage
              ),
          },
          {
            path: 'proyectos',
            loadComponent: () =>
              import('./features/admin/admin-proyectos/admin-proyectos.page').then(
                (m) => m.AdminProyectosPage
              ),
          },
        ],
      },
      // Menú Asignaciones
      {
        path: 'asignaciones',
        canActivate: [RoleGuard],
        data: { roles: ['Admin Global', 'Usuario'] },
        children: [
          {
            path: 'tenant-proyecto-plan',
            loadChildren: () =>
              import(
                './features/admin/admin-tenants-proyectos-planes/admin-tenants-proyectos-planes.module'
              ).then((m) => m.AdminTenantsProyectosPlanesModule),
          },
          {
            path: 'pagos-subscripciones',
            loadChildren: () =>
              import(
                './features/admin/admin-pagos-tenants-proyectos-planes/admin-pago-tenants-proyectos-planes.module'
              ).then((m) => m.AdminPagoTenantsProyectosPlanesModule),
          },
        ],
      },
      // Aquí puedes agregar más rutas hijas para proyectos, módulos, etc.
    ],
  },

  // Página de acceso denegado
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./shared/components/access-denied/access-denied.component').then(
        (m) => m.AccessDeniedComponent
      ),
  },

  // Página 404
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];

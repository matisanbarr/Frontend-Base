import { Routes } from '@angular/router';

export const asistenteRecepcionistaRoutes: Routes = [
  {
    path: 'cita',
    loadComponent: () => import('./cita/cita.page').then((m) => m.CitaPage),
  },
  {
    path: 'facturacion',
    loadComponent: () => import('./facturacion/facturacion.page').then((m) => m.FacturacionPage),
  },
  {
    path: 'inventario',
    loadComponent: () => import('./inventario/inventario.page').then((m) => m.InventarioPage),
  },
  {
    path: 'paciente',
    loadComponent: () => import('./paciente/paciente.page').then((m) => m.PacientePage),
  },
  // Puedes agregar más rutas internas aquí
];

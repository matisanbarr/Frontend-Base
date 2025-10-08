// Rutas principales del módulo veterinariaLabs
import { Routes } from '@angular/router';
import { VeterinariaLayoutComponent } from './components/veterinaria-layout.component';

export const veterinariaRoutes: Routes = [
  {
    path: '',
    component: VeterinariaLayoutComponent,
    children: [
      {
        path: 'asistente-recepcionista',
        loadChildren: () =>
          import('./pages/asistente-recepcionista/asistente-recepcionista.routes').then(
            (m) => m.asistenteRecepcionistaRoutes
          ),
      },
    ],
  },
];

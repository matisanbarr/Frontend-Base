import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// Importa aquí los componentes creados;
import { PagoTenantProyectoPlanFormComponent } from './components/pagos-tenants-proyectos-planes-form/pagos-tenants-proyectos-planes-form.component';
import { PagoTenantProyectoPlanListComponent } from './pages/pago-tenant-proyecto-plan-list/pago-tenant-proyecto-plan-list.component';
import { TenantProyectoPlanSelectorComponent } from './components/tenants-proyectos-planes-selector/tenants-proyectos-planes-selector.component';
import { AdminPagoTenantsProyectosPlanesRoutingModule } from './admin-pago-tenants-proyectos-planes-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TenantProyectoPlanSelectorComponent,
    PagoTenantProyectoPlanFormComponent,
    PagoTenantProyectoPlanListComponent,
    AdminPagoTenantsProyectosPlanesRoutingModule,
  ],
  exports: [],
})
export class AdminPagoTenantsProyectosPlanesModule {}

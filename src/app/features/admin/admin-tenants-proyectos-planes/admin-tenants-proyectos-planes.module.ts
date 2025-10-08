import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// Importa aquí los componentes creados
import { TenantSelectorComponent } from './components/tenant-selector/tenant-selector.component';
import { ProyectoSelectorComponent } from './components/proyecto-selector/proyecto-selector.component';
import { PlanSelectorComponent } from './components/plan-selector/plan-selector.component';
import { TenantProyectoPlanFormComponent } from './components/tenant-proyecto-plan-form/tenant-proyecto-plan-form.component';
import { TenantProyectoPlanListPage } from './pages/tenant-proyecto-plan-list/tenant-proyecto-plan-list.page';

import { AdminTenantsProyectosPlanesRoutingModule } from './admin-tenants-proyectos-planes-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TenantSelectorComponent,
    ProyectoSelectorComponent,
    PlanSelectorComponent,
    TenantProyectoPlanFormComponent,
    TenantProyectoPlanListPage,
    AdminTenantsProyectosPlanesRoutingModule,
  ],
  exports: [],
})
export class AdminTenantsProyectosPlanesModule {}

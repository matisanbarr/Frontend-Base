import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantProyectoPlanCrudPage } from './pages/tenant-proyecto-plan-crud/tenant-proyecto-plan-crud.page';

const routes: Routes = [{ path: '', component: TenantProyectoPlanCrudPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTenantsProyectosPlanesRoutingModule {}

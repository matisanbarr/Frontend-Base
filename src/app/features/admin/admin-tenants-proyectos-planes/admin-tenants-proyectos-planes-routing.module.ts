import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantProyectoPlanCrudComponent } from './pages/tenant-proyecto-plan-crud/tenant-proyecto-plan-crud.component';

const routes: Routes = [{ path: '', component: TenantProyectoPlanCrudComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTenantsProyectosPlanesRoutingModule {}

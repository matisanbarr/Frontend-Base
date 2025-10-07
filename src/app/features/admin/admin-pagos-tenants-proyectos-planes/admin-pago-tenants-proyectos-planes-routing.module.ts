import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagoTenantProyectoPlanCrudComponent } from './pages/pago-tenant-proyecto-plan-crud/pago-tenant-proyecto-plan-crud.component';

const routes: Routes = [{ path: '', component: PagoTenantProyectoPlanCrudComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPagoTenantsProyectosPlanesRoutingModule {}

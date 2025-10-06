import { Component, ViewChild } from '@angular/core';

import { PagoTenantProyectoPlanFormComponent } from '../../components/pagos-tenants-proyectos-planes-form/pagos-tenants-proyectos-planes-form.component';
import { CommonModule } from '@angular/common';
import { PagoTenantProyectoPlanListComponent } from '../pago-tenant-proyecto-plan-list/pago-tenant-proyecto-plan-list.component';

@Component({
  selector: 'app-pago-tenant-proyecto-plan-crud',
  standalone: true,
  templateUrl: './pago-tenant-proyecto-plan-crud.component.html',
  styleUrls: ['./pago-tenant-proyecto-plan-crud.component.scss'],
  imports: [CommonModule, PagoTenantProyectoPlanFormComponent, PagoTenantProyectoPlanListComponent],
})
export class PagoTenantProyectoPlanCrudComponent {
  @ViewChild(PagoTenantProyectoPlanListComponent)
  listComponent?: PagoTenantProyectoPlanListComponent;

  editData: any = null;

  onEdit(data: any) {
    this.editData = { ...data };
  }

  onSave() {
    this.editData = null;
    this.listComponent?.getAsignaciones();
  }
}

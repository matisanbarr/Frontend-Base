import { Component, ViewChild } from '@angular/core';
import { TenantProyectoPlanListPage } from '../tenant-proyecto-plan-list/tenant-proyecto-plan-list.page';

import { TenantProyectoPlanFormComponent } from '../../components/tenant-proyecto-plan-form/tenant-proyecto-plan-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenant-proyecto-plan-crud',
  standalone: true,
  templateUrl: './tenant-proyecto-plan-crud.page.html',
  styleUrls: ['./tenant-proyecto-plan-crud.page.scss'],
  imports: [CommonModule, TenantProyectoPlanFormComponent, TenantProyectoPlanListPage],
})
export class TenantProyectoPlanCrudPage {
  @ViewChild(TenantProyectoPlanListPage) listComponent?: TenantProyectoPlanListPage;

  editData: any = null;

  onEdit(data: any) {
    this.editData = { ...data };
  }

  onSave() {
    this.editData = null;
    this.listComponent?.getAsignaciones();
  }
}

import { Component, ViewChild } from '@angular/core';
import { TenantProyectoPlanListComponent } from '../tenant-proyecto-plan-list/tenant-proyecto-plan-list.component';

import { TenantProyectoPlanFormComponent } from '../../components/tenant-proyecto-plan-form/tenant-proyecto-plan-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenant-proyecto-plan-crud',
  standalone: true,
  templateUrl: './tenant-proyecto-plan-crud.component.html',
  styleUrls: ['./tenant-proyecto-plan-crud.component.scss'],
  imports: [CommonModule, TenantProyectoPlanFormComponent, TenantProyectoPlanListComponent],
})
export class TenantProyectoPlanCrudComponent {
  @ViewChild(TenantProyectoPlanListComponent) listComponent?: TenantProyectoPlanListComponent;

  onSave() {
    this.listComponent?.getAsignaciones();
  }
}

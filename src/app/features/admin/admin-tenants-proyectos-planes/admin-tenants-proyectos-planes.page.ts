import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TenantProyectoPlanCrudPage } from './pages/tenant-proyecto-plan-crud/tenant-proyecto-plan-crud.page';

@Component({
  selector: 'app-admin-tenants-proyectos-planes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TenantProyectoPlanCrudPage],
  templateUrl: './admin-tenants-proyectos-planes.page.html',
  styleUrls: ['./admin-tenants-proyectos-planes.page.scss'],
})
export class AdminTenantsProyectosPlanesPage {}

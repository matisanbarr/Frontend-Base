import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TenantProyectoPlanCrudComponent } from './pages/tenant-proyecto-plan-crud/tenant-proyecto-plan-crud.component';

@Component({
  selector: 'app-admin-tenants-proyectos-planes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TenantProyectoPlanCrudComponent],
  templateUrl: './admin-tenants-proyectos-planes.component.html',
  styleUrls: ['./admin-tenants-proyectos-planes.component.scss'],
})
export class AdminTenantsProyectosPlanesComponent {}

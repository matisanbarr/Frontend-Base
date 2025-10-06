import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PagoTenantProyectoPlanCrudComponent } from './pages/pago-tenant-proyecto-plan-crud/pago-tenant-proyecto-plan-crud.component';

@Component({
  selector: 'app-admin-pago-tenants-proyectos-planes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PagoTenantProyectoPlanCrudComponent],
  templateUrl: './admin-pago-tenants-proyectos-planes.component.html',
  styleUrls: ['./admin-pago-tenants-proyectos-planes.component.scss'],
})
export class AdminTenantsProyectosPlanesComponent {}

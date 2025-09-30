import { Component } from '@angular/core';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent, RouterModule, ToastAlertsComponent],
  templateUrl: './admin-tenants.component.html',
  styleUrls: ['./admin-tenants.component.scss']
})
export class AdminTenantsComponent {}
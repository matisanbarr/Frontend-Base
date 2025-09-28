import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Dashboard</h1>
            <button class="btn btn-outline-danger" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
            </button>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">¡Bienvenido!</h5>
              <p class="card-text">
                Has iniciado sesión exitosamente. Los guards están funcionando correctamente.
              </p>
              
              <div class="row mt-4" *ngIf="currentUser$ | async as user">
                <div class="col-md-6">
                  <div class="card bg-light">
                    <div class="card-body">
                      <h6 class="card-title">Información del Usuario</h6>
                      <p><strong>Usuario:</strong> {{ user.nombreUsuario }}</p>
                      <p><strong>ID:</strong> {{ user.id }}</p>
                      <p><strong>Creado:</strong> {{ user.fechaCreacion | date:'medium' }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="card bg-light">
                    <div class="card-body">
                      <h6 class="card-title">Roles del Usuario</h6>
                      <div *ngIf="userRoles.length > 0; else noRoles">
                        <span class="badge bg-primary me-1" *ngFor="let role of userRoles">
                          {{ role }}
                        </span>
                      </div>
                      <ng-template #noRoles>
                        <p class="text-muted">No hay roles asignados</p>
                      </ng-template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  currentUser$ = this.authService.currentUser$;
  userRoles: string[] = [];

  constructor(private authService: AuthService) {
    this.userRoles = this.authService.getCurrentUserRoles();
  }

  logout(): void {
    this.authService.logout();
  }
}
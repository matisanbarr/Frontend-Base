import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center">
          <div class="card border-warning">
            <div class="card-body">
              <i class="bi bi-shield-exclamation text-warning" style="font-size: 4rem;"></i>
              <h1 class="card-title mt-3">Acceso Denegado</h1>
              <p class="card-text text-muted">
                No tienes permisos suficientes para acceder a esta página.
              </p>
              <div class="mt-4">
                <button class="btn btn-primary me-2" (click)="goBack()">
                  <i class="bi bi-arrow-left"></i> Volver
                </button>
                <button class="btn btn-outline-primary" (click)="goToDashboard()">
                  <i class="bi bi-house"></i> Ir al Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}

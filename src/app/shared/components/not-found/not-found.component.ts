import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center">
          <div class="card">
            <div class="card-body">
              <i class="bi bi-exclamation-triangle text-danger" style="font-size: 4rem;"></i>
              <h1 class="card-title mt-3">404 - Página No Encontrada</h1>
              <p class="card-text text-muted">
                La página que buscas no existe o ha sido movida.
              </p>
              <div class="mt-4">
                <button class="btn btn-primary me-2" (click)="goBack()">
                  <i class="bi bi-arrow-left"></i> Volver
                </button>
                <button class="btn btn-outline-primary" (click)="goHome()">
                  <i class="bi bi-house"></i> Ir al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>La página que buscas no existe o ha sido movida.</p>
    <div class="mt-4">
      <button class="btn btn-primary me-2" (click)="goBack()">
        <i class="bi bi-arrow-left"></i> Volver
      </button>
      <button class="btn btn-outline-primary" (click)="goHome()">
        <i class="bi bi-house"></i> Ir al Inicio
      </button>
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
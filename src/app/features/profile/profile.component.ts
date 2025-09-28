import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Mi Perfil</h2>
      <div class="card">
        <div class="card-body">
          <p class="text-muted">Componente de perfil de usuario - próximo a implementar</p>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  constructor() {}
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">Iniciar Sesión</h2>
              <p class="text-center text-muted">Componente de login - próximo a implementar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  constructor() {}
}
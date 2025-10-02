import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">Registrar Nuevo Usuario</h2>
              <p class="text-center text-muted">
                Componente de registro de usuarios - próximo a implementar
              </p>
              <div class="alert alert-info">
                <i class="bi bi-info-circle"></i>
                <strong>Nota:</strong> Solo Admin Globales pueden registrar nuevos usuarios.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  constructor() {}
}

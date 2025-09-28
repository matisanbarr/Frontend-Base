import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="alert alert-success">
        <h4>¡Componente cargando correctamente!</h4>
        <p>Si ves esto, Angular está funcionando bien.</p>
        <hr>
        <p class="mb-0">
          <a href="/auth/login" class="btn btn-primary">Ir al Login</a>
          <a href="/dashboard" class="btn btn-secondary ms-2">Ir al Dashboard</a>
        </p>
      </div>
    </div>
  `
})
export class TestComponent {}
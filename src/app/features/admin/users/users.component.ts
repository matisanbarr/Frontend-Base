import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Gestión de Usuarios</h2>
      <div class="card">
        <div class="card-body">
          <p class="text-muted">Componente de gestión de usuarios - próximo a implementar</p>
          <p><strong>Nota:</strong> Solo accesible para usuarios con rol Admin o SuperAdmin</p>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent {
  constructor() {}
}
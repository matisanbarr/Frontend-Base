import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-people"></i> Gestión de Usuarios</h2>
        <div>
          <a href="/admin/register" class="btn btn-primary me-2">
            <i class="bi bi-person-plus"></i> Nuevo Usuario
          </a>
          <a href="/dashboard" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Volver
          </a>
        </div>
      </div>

      <div class="alert alert-success">
        <i class="bi bi-check-circle"></i>
        <strong>¡Guards funcionando!</strong> Solo usuarios con rol Admin o SuperAdmin pueden ver esta página.
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Lista de Usuarios</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Fecha Creación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>123e4567-e89b-12d3-a456-426614174000</code></td>
                  <td>admin</td>
                  <td>{{ currentDate | date:'short' }}</td>
                  <td><span class="badge bg-success">Activo</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><code>987fcdeb-51a2-34b5-c678-90123456789a</code></td>
                  <td>usuario1</td>
                  <td>{{ currentDate | date:'short' }}</td>
                  <td><span class="badge bg-success">Activo</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="text-center mt-3">
            <p class="text-muted">
              <em>Esta es una tabla de ejemplo. Los datos reales vendrán de tu API .NET Core</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent {
  currentDate = new Date();
  
  constructor() {}
}
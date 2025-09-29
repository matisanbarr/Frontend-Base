import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService, Rol } from '../../../core/services/rol.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent, RouterModule],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.scss'
})
export class AdminRolesComponent {
  rolForm: FormGroup;
  roles: Rol[] = [];
  loading = false;
  showConfirmModal = false;
  rolAEliminar: string | null = null;

  readonly rolService = inject(RolService);
  readonly fb = inject(FormBuilder);

  constructor() {
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.loading = true;
    this.rolService.listarRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  crearRol(): void {
    if (this.rolForm.invalid) return;
    const nuevoRol: Rol = { nombre: this.rolForm.value.nombre };
    this.rolService.crearRol(nuevoRol).subscribe({
      next: () => {
        this.cargarRoles();
        this.rolForm.reset();
      },
      error: (err) => {
        alert(err?.error?.mensaje || 'Error al crear el rol');
      }
    });
  }

  eliminarRol(nombre: string): void {
      this.rolAEliminar = nombre;
      this.showConfirmModal = true;
    }

    confirmarEliminacion(): void {
      if (!this.rolAEliminar) return;
      this.rolService.eliminarRol(this.rolAEliminar).subscribe({
        next: () => {
          this.cargarRoles();
          this.cerrarModal();
        },
        error: (err) => {
          alert(err?.error?.mensaje || 'Error al eliminar el rol');
          this.cerrarModal();
        }
      });
    }

    cerrarModal(): void {
      this.showConfirmModal = false;
      this.rolAEliminar = null;
  }
}
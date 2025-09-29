import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../../core/services/usuario.service';
import { ConfirmModalComponent } from "../../../shared/components";
import { RegistroUsuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  userForm: FormGroup;
  usuarios: RegistroUsuario[] = [];
  loading = false;
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalRegistros: number = 0;

  showModalVer = false;
  showModalResetPassword = false;
  showModalAsignarRoles = false;
  showModalQuitarRoles = false;
  usuarioSeleccionado: any = null;
  rolesDisponibles: any[] = [
    { nombre: 'Administrador', seleccionado: false },
    { nombre: 'Usuario', seleccionado: false },
    { nombre: 'Moderador', seleccionado: false }
  ];
  rolesAsignados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private rolService: RolService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
  this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    const filtro = {
      filtro: this.filtroBusqueda,
      pagina: this.paginaActual,
      tamano: 10,
      descendente: false
    };
    this.rolService.listarPaginadoUsuarios(filtro).subscribe({
      next: (respuesta) => {
        this.usuarios = respuesta.datos;
        this.totalRegistros = respuesta.total;
        this.totalPaginas = Math.ceil(respuesta.total / filtro.tamano);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Nuevo usuario:', this.userForm.value);
      this.userForm.reset();
    }
  }

  buscarUsuarios(): void {
    this.paginaActual = 1;
    this.cargarUsuarios();
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarUsuarios();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarUsuarios();
    }
  }

  abrirModalVer(user: any) {
    this.usuarioSeleccionado = user;
    this.showModalVer = true;
  }
  cerrarModalVer() {
    this.showModalVer = false;
    this.usuarioSeleccionado = null;
  }

  abrirModalResetPassword(user: any) {
    this.usuarioSeleccionado = user;
    this.showModalResetPassword = true;
  }
  cerrarModalResetPassword() {
    this.showModalResetPassword = false;
    this.usuarioSeleccionado = null;
  }
  resetearPassword() {
    // Aquí deberías llamar a tu servicio de reset de password cuando esté disponible
    // Por ahora solo cierra el modal
    this.cerrarModalResetPassword();
  }

  abrirModalAsignarRoles(user: any) {
    this.usuarioSeleccionado = user;
    // Resetear selección de roles
    this.rolesDisponibles.forEach(r => r.seleccionado = false);
    this.showModalAsignarRoles = true;
  }
  cerrarModalAsignarRoles() {
    this.showModalAsignarRoles = false;
    this.usuarioSeleccionado = null;
  }
  asignarRoles() {
    const rolesId = this.rolesDisponibles.filter(r => r.seleccionado).map(r => r.id);
    const payload = {
      usuarioId: this.usuarioSeleccionado.id,
      rolesId: rolesId
    };
    this.rolService.asignarRoles(payload).subscribe({
      next: () => {
  this.cerrarModalAsignarRoles();
  this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al asignar roles', err);
      }
    });
  }

  abrirModalQuitarRoles(user: any) {
    this.usuarioSeleccionado = user;
    // Simular roles asignados al usuario
    this.rolesAsignados = [
      { nombre: 'Usuario', seleccionado: false },
      { nombre: 'Moderador', seleccionado: false }
    ];
    this.showModalQuitarRoles = true;
  }
  cerrarModalQuitarRoles() {
    this.showModalQuitarRoles = false;
    this.usuarioSeleccionado = null;
  }
  quitarRoles() {
    const rolesId = this.rolesAsignados.filter(r => r.seleccionado).map(r => r.id);
    const payload = {
      usuarioId: this.usuarioSeleccionado.id,
      rolesId: rolesId
    };
    this.rolService.aquitarRoles(payload).subscribe({
      next: () => {
  this.cerrarModalQuitarRoles();
  this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al quitar roles', err);
      }
    });
  }

  editUser(user: any): void {
    console.log('Editar usuario:', user);
  }

  viewUser(user: any): void {
    console.log('Ver usuario:', user);
  }

  deleteUser(user: any): void {
    console.log('Eliminar usuario:', user);
  }
}
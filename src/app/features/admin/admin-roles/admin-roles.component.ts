import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.scss'
})
export class AdminRolesComponent {
  roleForm: FormGroup;
  roles: any[] = [];
  permissions: string[] = [];
  selectedRole: any = null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService
  ) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      color: ['primary', [Validators.required]],
      permissions: [[]]
    });
    
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    // Simulación de datos de roles
    this.roles = [
      { 
        id: 1, 
        name: 'Super Administrador', 
        description: 'Acceso completo al sistema', 
        color: 'warning',
        permissions: ['users.create', 'users.read', 'users.update', 'users.delete', 'roles.manage'],
        userCount: 2,
        active: true
      },
      { 
        id: 2, 
        name: 'Administrador', 
        description: 'Gestión de usuarios y configuración', 
        color: 'primary',
        permissions: ['users.read', 'users.update', 'roles.read'],
        userCount: 8,
        active: true
      },
      { 
        id: 3, 
        name: 'Moderador', 
        description: 'Moderación de contenido y usuarios', 
        color: 'secondary',
        permissions: ['content.moderate', 'users.read', 'reports.view'],
        userCount: 15,
        active: true
      },
      { 
        id: 4, 
        name: 'Usuario', 
        description: 'Acceso básico al sistema', 
        color: 'success',
        permissions: ['profile.read', 'profile.update', 'dashboard.access'],
        userCount: 131,
        active: true
      }
    ];
  }

  loadPermissions(): void {
    this.permissions = [
      'users.create', 'users.read', 'users.update', 'users.delete',
      'roles.create', 'roles.read', 'roles.update', 'roles.delete',
      'content.create', 'content.read', 'content.update', 'content.delete', 'content.moderate',
      'reports.view', 'reports.create',
      'system.config', 'system.logs', 'system.backup',
      'profile.read', 'profile.update',
      'dashboard.access'
    ];
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      console.log('Nuevo rol:', this.roleForm.value);
      this.roleForm.reset();
    }
  }

  editRole(role: any): void {
    this.selectedRole = role;
    console.log('Editar rol:', role);
  }

  viewRole(role: any): void {
    console.log('Ver rol:', role);
  }

  duplicateRole(role: any): void {
    console.log('Duplicar rol:', role);
  }

  deleteRole(role: any): void {
    console.log('Eliminar rol:', role);
  }

  syncPermissions(): void {
    console.log('Sincronizando permisos...');
  }

  verifyRoleSecurity(): void {
    console.log('Verificando seguridad de roles...');
  }

  exportConfiguration(): void {
    console.log('Exportando configuración...');
  }
}
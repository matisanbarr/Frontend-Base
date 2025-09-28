import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  userForm: FormGroup;
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    this.loadUsers();
  }

  loadUsers(): void {
    // Simulación de datos de usuarios
    this.users = [
      { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com', role: 'Admin', status: 'Active', lastLogin: '2 horas' },
      { id: 2, firstName: 'María', lastName: 'García', email: 'maria.garcia@example.com', role: 'User', status: 'Active', lastLogin: '1 día' },
      { id: 3, firstName: 'Carlos', lastName: 'López', email: 'carlos.lopez@example.com', role: 'Moderator', status: 'Pending', lastLogin: 'Nunca' }
    ];
    this.filteredUsers = [...this.users];
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Nuevo usuario:', this.userForm.value);
      this.userForm.reset();
    }
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role.toLowerCase() === this.selectedRole.toLowerCase();
      const matchesStatus = !this.selectedStatus || user.status.toLowerCase() === this.selectedStatus.toLowerCase();
      
      return matchesSearch && matchesRole && matchesStatus;
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
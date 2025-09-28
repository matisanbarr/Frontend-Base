import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../models';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData: LoginRequest = {
    usuario: '',
    password: ''
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  rememberMe: boolean = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  constructor() {}

  onLogin(): void {
    if (!this.loginData.usuario || !this.loginData.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';
        this.errorMessage = '';
        this.loadingService.show();
        // Verificar si el token está expirado
        if (this.authService.isTokenExpired()) {
          // Intentar refrescar el token
          this.authService.refreshToken().subscribe({
            next: () => {
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              this.errorMessage = 'Sesión expirada, por favor inicia sesión nuevamente.';
              this.authService.logout();
            }
          });
        } else {
          // Token válido, redirigir al dashboard
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Error al iniciar sesión';
        this.successMessage = '';
        this.loadingService.hide();
      },
      complete: () => {
        this.isLoading = false;
        this.loadingService.hide();
    }
    });
}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../models';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginData: LoginRequest = {
    nombreUsuario: '',
    password: '',
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  rememberMe: boolean = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    // Mostrar mensaje si la sesión expiró
    this.route.queryParams.subscribe((params) => {
      if (params['sessionExpired']) {
        this.errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
      }
    });
  }

  onLogin(): void {
    if (!this.loginData.nombreUsuario || !this.loginData.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (resp) => {
        if (resp.codigoRespuesta === 0) {
          this.successMessage = 'Inicio de sesión exitoso. Redirigiendo...';
          this.loadingService.show();
          // Validar que el token no esté expirado por desfase UTC
          if (this.authService.isTokenExpired()) {
            this.isLoading = false;
            this.loadingService.hide();
            this.errorMessage =
              'El token recibido ya está expirado (UTC). Por favor, revisa la hora del servidor o contacta a soporte.';
            this.authService.logout();
            return;
          }
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
          this.loadingService.hide();
        } else {
          this.isLoading = false;
          this.errorMessage =
            resp.glosaRespuesta || 'Error en interno, por favor intente nuevamente';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.message ||
          err?.mensaje ||
          err?.error?.mensaje ||
          err?.error?.message ||
          'Error al iniciar sesión';
        this.successMessage = '';
        this.loadingService.hide();
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}

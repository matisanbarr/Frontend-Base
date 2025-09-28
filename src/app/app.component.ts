
import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LoadingComponent } from './shared/components/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Frontend App';
  isLoggedIn: boolean = false;
  hasAdminRole: boolean = false;

  constructor(private authService: AuthService) {
    // Suscribirse a los cambios de autenticación
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.hasAdminRole = this.authService.hasAnyRole(['Administrador']);
    });
  }

  logout(): void {
    this.authService.logout();
    // Actualizar estado inmediatamente después de logout
    this.isLoggedIn = this.authService.isLoggedIn();
    this.hasAdminRole = this.authService.hasAnyRole(['Administrador']);
  }
}

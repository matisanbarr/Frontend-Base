import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MainNavbarComponent } from './shared/components/layout/main-navbar.component';
import { MainFooterComponent } from './shared/components/layout/main-footer.component';
import { AlertGlobalComponent } from './shared/components/alert-global.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainNavbarComponent, MainFooterComponent, AlertGlobalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Grimat Labs';
  isLoggedIn: boolean = false;
  hasAdminRole: boolean = false;
  hasUserRole: boolean = false;

  constructor(private authService: AuthService) {
    // Suscribirse a los cambios de autenticación
    this.authService.isAuthenticated$.subscribe((auth) => {
      this.isLoggedIn = this.authService.isLoggedIn();
      this.hasAdminRole = this.authService.hasAnyRole(['Admin Global']);
      this.hasUserRole = this.authService.hasAnyRole(['Usuario']);
    });
  }

  logout(): void {
    this.authService.logout();
    // Actualizar estado inmediatamente después de logout
    this.isLoggedIn = this.authService.isLoggedIn();
    this.hasAdminRole = this.authService.hasAnyRole(['Admin Global']);
    this.hasUserRole = this.authService.hasAnyRole(['Usuario']);
  }
}

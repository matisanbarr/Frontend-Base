import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, CommonModule],
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss'],
})
export class MainNavbarComponent {
  get nombreBienvenida(): string {
    if (!this.currentUser) return '';
    const pn = this.currentUser.primerNombre || '';
    const pa = this.currentUser.primerApellido || '';
    const sa = this.currentUser.segundoApellido || '';
    let nombre = pn;
    if (pa) nombre += ' ' + pa;
    if (sa) nombre += ' ' + sa.charAt(0).toUpperCase() + '.';
    return nombre.trim();
  }
  isLoggedIn = false;
  hasAdminRole = false;
  hasUserRole = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {
    // Inicialización directa al cargar el componente
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    const roles = this.authService.getCurrentUserRoles();
    this.hasAdminRole = roles.includes('Admin Global');
    this.hasUserRole = roles.includes('Usuario');

    // Suscripción para cambios en tiempo real
    this.authService.isAuthenticated$.subscribe((auth) => {
      this.isLoggedIn = auth;
      this.currentUser = this.authService.getCurrentUser();
      const roles = this.authService.getCurrentUserRoles();
      this.hasAdminRole = roles.includes('Admin Global');
      this.hasUserRole = roles.includes('Usuario');
    });
  }

  logout() {
    this.authService.logout();
  }
}

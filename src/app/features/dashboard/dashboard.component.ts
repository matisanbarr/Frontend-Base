import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  currentUser$ = this.authService.currentUser$;
  userRoles: string[] = [];
  hasAdminRole: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {
    this.userRoles = this.authService.getCurrentUserRoles();
    this.hasAdminRole = this.authService.hasAnyRole(['Administrador', 'Usuario']);
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }

  testRoute(route: string): void {
    window.location.href = route;
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  currentUser$ = this.authService.currentUser$;
  userRoles: string[] = [];
  hasAdminRole: boolean = false;
  isLoggedIn: boolean = false;

  // Referencia para el template de usuario estándar
  userDashboard: any;

  constructor(private authService: AuthService, private router: Router) {
    this.userRoles = this.authService.getCurrentUserRoles();
    this.hasAdminRole = this.authService.hasAnyRole(['Admin Global', 'Usuario']);
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }
}
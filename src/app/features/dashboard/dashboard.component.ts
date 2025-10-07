import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProyectoService } from '../../core/services/proyecto.service';
import { Proyecto } from '../../models/proyecto.model';
import { SidebarComponent } from '../../shared/components/sidebar.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HomeComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  showHamburger = true;
  // Métodos para controlar visibilidad del botón hamburguesa
  onOffcanvasShown() {
    this.showHamburger = false;
  }
  onOffcanvasHidden() {
    this.showHamburger = true;
  }
  private userSub?: Subscription;
  currentUser$ = this.authService.currentUser$;
  userName: string | null = null;
  userRoles: string[] = [];
  isLoggedIn: boolean = false;
  isAdminGlobal: boolean | null = null;
  proyectos: Proyecto[] = [];
  sidebarCollapsed = false;
  adminMenuOpen = false;
  proyectosMenuOpen: { [id: string]: boolean } = {};

  constructor(
    private authService: AuthService,
    private proyectoService: ProyectoService,
    private router: Router
  ) {
    this.userRoles = this.authService.getCurrentUserRoles();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.userName = (user as any)?.nombre || (user as any)?.name || '';
      const roles = (user as any)?.roles || [];
      this.isAdminGlobal = Array.isArray(roles) && roles.includes('Admin Global');
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  filtrarProyectosPorUsuario(proyectos: Proyecto[]): Proyecto[] {
    // Aquí puedes filtrar los proyectos según el usuario logueado
    // Por ahora, devolvemos todos (ajusta según tu lógica)
    return proyectos;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleAdminMenu(): void {
    this.adminMenuOpen = !this.adminMenuOpen;
  }

  toggleProyectoMenu(proyecto: any): void {
    // Acepta tanto Proyecto como Event, pero solo actúa si es Proyecto
    if (proyecto && (proyecto.nombre || proyecto.id)) {
      this.proyectosMenuOpen[proyecto.id || proyecto.nombre] =
        !this.proyectosMenuOpen[proyecto.id || proyecto.nombre];
    }
  }

  isProyectoMenuOpen(proyecto: Proyecto): boolean {
    return !!this.proyectosMenuOpen[proyecto.id || proyecto.nombre];
  }

  getComponentesProyecto(proyecto: Proyecto): { label: string; route: string; icon: string }[] {
    // Devuelve los componentes/links de cada proyecto
    // Puedes personalizar según la estructura de cada proyecto
    return [
      {
        label: 'Dashboard',
        route: `/proyectos/${proyecto.id || proyecto.nombre}/dashboard`,
        icon: 'bi-speedometer2',
      },
      {
        label: 'Módulo 1',
        route: `/proyectos/${proyecto.id || proyecto.nombre}/modulo1`,
        icon: 'bi-box',
      },
      // Agrega más módulos/componentes según tu app
    ];
  }

  logout(): void {
    this.authService.logout();
  }
}

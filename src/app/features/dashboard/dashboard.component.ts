
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProyectoService } from '../../core/services/proyecto.service';
import { Proyecto } from '../../models/proyecto.model';
import { SidebarComponent } from '../../shared/components/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;
  userRoles: string[] = [];
  isLoggedIn: boolean = false;
  isAdminGlobal: boolean = false;
  proyectos: Proyecto[] = [];
  sidebarCollapsed = false;
  adminMenuOpen = true;
  proyectosMenuOpen: { [id: string]: boolean } = {};

  constructor(
    private authService: AuthService,
    private proyectoService: ProyectoService,
    private router: Router
  ) {
    this.userRoles = this.authService.getCurrentUserRoles();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdminGlobal = this.authService.hasRole('Admin Global');
  }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.proyectoService.listarProyectos().subscribe((proyectos) => {
      // Si es Admin Global ve todos, si no, filtrar según lógica de negocio
      this.proyectos = this.isAdminGlobal ? proyectos : this.filtrarProyectosPorUsuario(proyectos);
    });
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
      this.proyectosMenuOpen[proyecto.id || proyecto.nombre] = !this.proyectosMenuOpen[proyecto.id || proyecto.nombre];
    }
  }

  isProyectoMenuOpen(proyecto: Proyecto): boolean {
    return !!this.proyectosMenuOpen[proyecto.id || proyecto.nombre];
  }

  getComponentesProyecto(proyecto: Proyecto): { label: string; route: string; icon: string }[] {
    // Devuelve los componentes/links de cada proyecto
    // Puedes personalizar según la estructura de cada proyecto
    return [
      { label: 'Dashboard', route: `/proyectos/${proyecto.id || proyecto.nombre}/dashboard`, icon: 'bi-speedometer2' },
      { label: 'Módulo 1', route: `/proyectos/${proyecto.id || proyecto.nombre}/modulo1`, icon: 'bi-box' },
      // Agrega más módulos/componentes según tu app
    ];
  }

  logout(): void {
    this.authService.logout();
  }
}
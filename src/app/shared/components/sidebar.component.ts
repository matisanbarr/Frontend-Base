import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { Proyecto } from '../../models/proyecto.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProyectoService } from '../../core/services/proyecto.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isLoading = true;
  @Input() sidebarCollapsed = false;
  @Input() isAdminGlobal: boolean | null = null;
  @Input() adminMenuOpen = false;
  @Input() proyectosMenuOpen: { [id: string]: boolean } = {};
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleAdminMenuEvent = new EventEmitter<void>();
  @Output() toggleProyectoMenuEvent = new EventEmitter<Proyecto>();
  @Input() isProyectoMenuOpen: (proyecto: Proyecto) => boolean = () => false;
  @Input() getComponentesProyecto: (
    proyecto: Proyecto
  ) => { label: string; route: string; icon: string }[] = () => [];

  proyectos: Proyecto[] = [];
  mantenedoresMenuOpen = false;
  gestionesMenuOpen = false;
  informesMenuOpen = false;
  auditoriasMenuOpen = false;
  veterinariaMenuOpen = false;
  vetAdminMenuOpen = false;
  vetVeterinarioMenuOpen = false;
  vetAsistenteMenuOpen = false;

  private readonly STORAGE_KEY = 'sidebar-menu-state';

  ngOnInit(): void {
    this.isLoading = false;
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
  // Solo un menú principal abierto a la vez
  toggleAdminMenu() {
    this.adminMenuOpen = !this.adminMenuOpen;
    if (this.adminMenuOpen) {
      this.mantenedoresMenuOpen = false;
      this.gestionesMenuOpen = false;
      this.informesMenuOpen = false;
      this.auditoriasMenuOpen = false;
      this.veterinariaMenuOpen = false;
    }
    this.toggleAdminMenuEvent.emit();
  }

  toggleMantenedoresMenu() {
    this.mantenedoresMenuOpen = !this.mantenedoresMenuOpen;
    if (this.mantenedoresMenuOpen) {
      // Solo cerrar otros submenús hermanos dentro de Administración
      this.gestionesMenuOpen = false;
      this.informesMenuOpen = false;
      this.auditoriasMenuOpen = false;
    }
  }

  toggleGestionesMenu() {
    this.gestionesMenuOpen = !this.gestionesMenuOpen;
    if (this.gestionesMenuOpen) {
      this.mantenedoresMenuOpen = false;
      this.informesMenuOpen = false;
      this.auditoriasMenuOpen = false;
    }
  }
}

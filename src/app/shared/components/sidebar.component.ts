import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Proyecto } from '../../models/proyecto.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() sidebarCollapsed = false;
  @Input() isAdminGlobal: boolean | null = null;
  @Input() adminMenuOpen = false;
  @Input() proyectos: Proyecto[] = [];
  @Input() proyectosMenuOpen: { [id: string]: boolean } = {};
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleAdminMenuEvent = new EventEmitter<void>();
  @Output() toggleProyectoMenuEvent = new EventEmitter<Proyecto>();
  @Input() isProyectoMenuOpen: (proyecto: Proyecto) => boolean = () => false;
  @Input() getComponentesProyecto: (
    proyecto: Proyecto
  ) => { label: string; route: string; icon: string }[] = () => [];

  mantenedoresMenuOpen = false;
  gestionesMenuOpen = false;
  informesMenuOpen = false;
  auditoriasMenuOpen = false;

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
  toggleAdminMenu() {
    this.toggleAdminMenuEvent.emit();
  }
  toggleProyectoMenu(proyecto: Proyecto) {
    this.toggleProyectoMenuEvent.emit(proyecto);
  }

  toggleMantenedoresMenu() {
    this.mantenedoresMenuOpen = !this.mantenedoresMenuOpen;
  }

  toggleGestionesMenu() {
    this.gestionesMenuOpen = !this.gestionesMenuOpen;
  }

  toggleInformesMenu() {
    this.informesMenuOpen = !this.informesMenuOpen;
  }

  toggleAuditoriasMenu() {
    this.auditoriasMenuOpen = !this.auditoriasMenuOpen;
  }
}

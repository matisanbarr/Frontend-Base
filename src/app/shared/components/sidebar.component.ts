import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class SidebarComponent implements OnInit {
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

  private readonly STORAGE_KEY = 'sidebar-menu-state';

  ngOnInit(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        this.mantenedoresMenuOpen = !!state.mantenedoresMenuOpen;
        this.gestionesMenuOpen = !!state.gestionesMenuOpen;
        this.informesMenuOpen = !!state.informesMenuOpen;
        this.auditoriasMenuOpen = !!state.auditoriasMenuOpen;
        this.adminMenuOpen = !!state.adminMenuOpen;
      } catch {}
    }
  }

  private saveState() {
    const state = {
      mantenedoresMenuOpen: this.mantenedoresMenuOpen,
      gestionesMenuOpen: this.gestionesMenuOpen,
      informesMenuOpen: this.informesMenuOpen,
      auditoriasMenuOpen: this.auditoriasMenuOpen,
      adminMenuOpen: this.adminMenuOpen,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
  toggleAdminMenu() {
    this.adminMenuOpen = !this.adminMenuOpen;
    this.toggleAdminMenuEvent.emit();
    this.saveState();
  }
  toggleProyectoMenu(proyecto: Proyecto) {
    this.toggleProyectoMenuEvent.emit(proyecto);
  }

  toggleMantenedoresMenu() {
    this.mantenedoresMenuOpen = !this.mantenedoresMenuOpen;
    this.saveState();
  }

  toggleGestionesMenu() {
    this.gestionesMenuOpen = !this.gestionesMenuOpen;
    this.saveState();
  }

  toggleInformesMenu() {
    this.informesMenuOpen = !this.informesMenuOpen;
    this.saveState();
  }

  toggleAuditoriasMenu() {
    this.auditoriasMenuOpen = !this.auditoriasMenuOpen;
    this.saveState();
  }
}

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
  // Flags para visibilidad de menús de veterinaria
  showVetAdminMenu = false;
  showVetVeterinarioMenu = false;
  showVetAsistenteMenu = false;
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
  private proyectoService = inject(ProyectoService);
  private isAdminGlobalUser: boolean = false;
  private proyectoIdsUsuario: string[] = [];

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
        this.veterinariaMenuOpen = !!state.veterinariaMenuOpen;
        this.vetAdminMenuOpen = !!state.vetAdminMenuOpen;
        this.vetVeterinarioMenuOpen = !!state.vetVeterinarioMenuOpen;
        this.vetAsistenteMenuOpen = !!state.vetAsistenteMenuOpen;
      } catch {}
    }
    // Obtener usuario actual y roles
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        const currentUser = JSON.parse(userStr);
        const roles = currentUser?.roles || [];
        this.isAdminGlobalUser = Array.isArray(roles) && roles.includes('Admin Global');
        if (Array.isArray(currentUser?.proyectos)) {
          this.proyectoIdsUsuario = currentUser.proyectos.map((p: any) => String(p.ProyectoId));
        }
        // Lógica de visibilidad de menús de veterinaria
        // Mostrar todos los menús de veterinaria para depuración
        this.showVetAdminMenu = true;
        this.showVetVeterinarioMenu = true;
        this.showVetAsistenteMenu = true;
      } catch {}
    }
    // Cargar proyectos como menú principal
    this.proyectoService.listarProyectos().subscribe({
      next: (resp) => {
        if (resp && resp.respuesta) {
          if (this.isAdminGlobalUser) {
            this.proyectos = resp.respuesta;
          } else {
            this.proyectos = resp.respuesta.filter(
              (p: Proyecto) => p.id && this.proyectoIdsUsuario.includes(String(p.id))
            );
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.proyectos = [];
        this.isLoading = false;
      },
    });
  }

  private saveState() {
    const state = {
      mantenedoresMenuOpen: this.mantenedoresMenuOpen,
      gestionesMenuOpen: this.gestionesMenuOpen,
      informesMenuOpen: this.informesMenuOpen,
      auditoriasMenuOpen: this.auditoriasMenuOpen,
      adminMenuOpen: this.adminMenuOpen,
      veterinariaMenuOpen: this.veterinariaMenuOpen,
      vetAdminMenuOpen: this.vetAdminMenuOpen,
      vetVeterinarioMenuOpen: this.vetVeterinarioMenuOpen,
      vetAsistenteMenuOpen: this.vetAsistenteMenuOpen,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
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
    this.saveState();
  }

  toggleMantenedoresMenu() {
    this.mantenedoresMenuOpen = !this.mantenedoresMenuOpen;
    if (this.mantenedoresMenuOpen) {
      // Solo cerrar otros submenús hermanos dentro de Administración
      this.gestionesMenuOpen = false;
      this.informesMenuOpen = false;
      this.auditoriasMenuOpen = false;
    }
    this.saveState();
  }

  toggleGestionesMenu() {
    this.gestionesMenuOpen = !this.gestionesMenuOpen;
    if (this.gestionesMenuOpen) {
      this.mantenedoresMenuOpen = false;
      this.informesMenuOpen = false;
      this.auditoriasMenuOpen = false;
    }
    this.saveState();
  }

  toggleInformesMenu() {
    this.informesMenuOpen = !this.informesMenuOpen;
    if (this.informesMenuOpen) {
      this.mantenedoresMenuOpen = false;
      this.gestionesMenuOpen = false;
      this.auditoriasMenuOpen = false;
    }
    this.saveState();
  }

  toggleAuditoriasMenu() {
    this.auditoriasMenuOpen = !this.auditoriasMenuOpen;
    if (this.auditoriasMenuOpen) {
      this.mantenedoresMenuOpen = false;
      this.gestionesMenuOpen = false;
      this.informesMenuOpen = false;
    }
    this.saveState();
  }

  toggleVeterinariaMenu() {
    this.veterinariaMenuOpen = !this.veterinariaMenuOpen;
    if (this.veterinariaMenuOpen) {
      this.adminMenuOpen = false;
      this.mantenedoresMenuOpen = false;
      this.gestionesMenuOpen = false;
      this.informesMenuOpen = false;
      this.auditoriasMenuOpen = false;
    }
    this.saveState();
  }

  // Solo un submenú de veterinaria abierto a la vez
  toggleVetAdminMenu() {
    this.vetAdminMenuOpen = !this.vetAdminMenuOpen;
    if (this.vetAdminMenuOpen) {
      this.vetVeterinarioMenuOpen = false;
      this.vetAsistenteMenuOpen = false;
    }
    this.saveState();
  }
  toggleVetVeterinarioMenu() {
    this.vetVeterinarioMenuOpen = !this.vetVeterinarioMenuOpen;
    if (this.vetVeterinarioMenuOpen) {
      this.vetAdminMenuOpen = false;
      this.vetAsistenteMenuOpen = false;
    }
    this.saveState();
  }
  toggleVetAsistenteMenu() {
    this.vetAsistenteMenuOpen = !this.vetAsistenteMenuOpen;
    if (this.vetAsistenteMenuOpen) {
      this.vetAdminMenuOpen = false;
      this.vetVeterinarioMenuOpen = false;
    }
    this.saveState();
  }

  // Para futuros proyectos, solo uno abierto
  toggleProyectoMenu(proyecto: Proyecto) {
    Object.keys(this.proyectosMenuOpen).forEach((id) => {
      this.proyectosMenuOpen[id] = false;
    });
    if (proyecto.id !== undefined) {
      this.proyectosMenuOpen[String(proyecto.id)] = true;
    }
    this.toggleProyectoMenuEvent.emit(proyecto);
    this.saveState();
  }
}

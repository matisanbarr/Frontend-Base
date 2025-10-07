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
        // Si es Admin Global, ve todo
        if (this.isAdminGlobalUser) {
          this.showVetAdminMenu = true;
          this.showVetVeterinarioMenu = true;
          this.showVetAsistenteMenu = true;
        } else {
          // Se asume que el rol principal está en roles[0] o se puede ajustar según tu modelo
          const rolPrincipal = Array.isArray(roles) && roles.length > 0 ? roles[0] : '';
          if (rolPrincipal === 'Veterinario Jefe') {
            this.showVetAdminMenu = true;
            this.showVetVeterinarioMenu = true;
            this.showVetAsistenteMenu = true;
          } else if (rolPrincipal === 'Veterinario') {
            this.showVetAdminMenu = false;
            this.showVetVeterinarioMenu = true;
            this.showVetAsistenteMenu = true;
          } else if (
            rolPrincipal === 'Asistente' ||
            rolPrincipal === 'Recepcionista' ||
            rolPrincipal === 'Asistente/Recepcionista'
          ) {
            this.showVetAdminMenu = false;
            this.showVetVeterinarioMenu = false;
            this.showVetAsistenteMenu = true;
          } else {
            // Por defecto, no muestra nada
            this.showVetAdminMenu = false;
            this.showVetVeterinarioMenu = false;
            this.showVetAsistenteMenu = false;
          }
        }
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

  // Métodos para Veterinaria
  toggleVeterinariaMenu() {
    this.veterinariaMenuOpen = !this.veterinariaMenuOpen;
    this.saveState();
  }
  toggleVetAdminMenu() {
    this.vetAdminMenuOpen = !this.vetAdminMenuOpen;
    this.saveState();
  }
  toggleVetVeterinarioMenu() {
    this.vetVeterinarioMenuOpen = !this.vetVeterinarioMenuOpen;
    this.saveState();
  }
  toggleVetAsistenteMenu() {
    this.vetAsistenteMenuOpen = !this.vetAsistenteMenuOpen;
    this.saveState();
  }
}

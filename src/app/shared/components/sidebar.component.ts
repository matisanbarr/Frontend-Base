import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Proyecto } from '../../models/proyecto.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() sidebarCollapsed = false;
  @Input() isAdminGlobal = false;
  @Input() adminMenuOpen = true;
  @Input() proyectos: Proyecto[] = [];
  @Input() proyectosMenuOpen: { [id: string]: boolean } = {};
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleAdminMenuEvent = new EventEmitter<void>();
  @Output() toggleProyectoMenuEvent = new EventEmitter<Proyecto>();

  @Input() getComponentesProyecto: (proyecto: Proyecto) => { label: string; route: string; icon: string }[] = () => [];
  @Input() isProyectoMenuOpen: (proyecto: Proyecto) => boolean = () => false;

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
  toggleAdminMenu() {
    this.toggleAdminMenuEvent.emit();
  }
  toggleProyectoMenu(proyecto: Proyecto) {
    this.toggleProyectoMenuEvent.emit(proyecto);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent<T = any> {
  @Input() items: T[] = [];
  @Input() emptyText = 'No hay registros.';
  @Input() loading = false;
  @Input() itemKey: string = 'id';

  // Nuevos inputs opcionales para visualización rica
  @Input() nombreFn?: (item: T) => string | null;
  @Input() descriptionFn?: (item: T) => string | null;
  @Input() correoFn?: (item: T) => string | null;
  @Input() estadoFn?: (item: T) => boolean | null;
  @Input() telefonoFn?: (item: T) => string | null;
  @Input() direccionFn?: (item: T) => string | null;
  @Input() precioFn?: (item: T) => number | null;
  @Input() maximoUsuariosFn?: (item: T) => number | null;
  @Input() subscripcionFn?: (item: T) => string | null;
  @Input() fechaInicioFn?: (item: T) => string | null;
  @Input() fechaFinFn?: (item: T) => string | null;
  @Input() diasRestantesFn?: (item: T) => number | null;

  @Output() edit = new EventEmitter<T>();
  @Output() remove = new EventEmitter<T>();
  @Output() roles = new EventEmitter<T>();
  // Para el pipe de color de roles
  @Input() rolesDisponiblesInput?: any[];

  //Funciones
  diasToNum(dias: number | null): number {
    if (!dias) return 0;
    return dias;
  }
}

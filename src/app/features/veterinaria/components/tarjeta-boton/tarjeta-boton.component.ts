import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tarjeta-boton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-boton.component.html',
  styleUrls: ['./tarjeta-boton.component.scss'],
})
export class TarjetaBotonComponent {
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  @Input() icono: string = '';
  @Input() colorFondo: string = '#fff';
  @Input() colorBoton: string = '#007bff';

  @Output() clickTarjeta = new EventEmitter<void>();

  onClick() {
    this.clickTarjeta.emit();
  }
}

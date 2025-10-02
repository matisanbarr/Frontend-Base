import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-buttons.component.html',
  styleUrls: ['./form-buttons.component.scss'],
})
export class FormButtonsComponent {
  @Input() modoEdicion: boolean = false;
  @Input() formInvalid: boolean = false;
  @Input() loading: boolean = false;
  @Input() hayCambios: boolean = true;
  @Input() crearLabel: string = 'Crear';
  @Input() modificarLabel: string = 'Modificar';
  @Input() limpiarVisible: boolean = true;

  @Output() limpiar = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onLimpiar() {
    this.limpiar.emit();
  }

  onSubmit() {
    this.submit.emit();
  }
}

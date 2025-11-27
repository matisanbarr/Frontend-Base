import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
})
export class FormHeaderComponent {
  @Input() icon: string = '';
  @Input() titulo: string = '';
  @Input() modoEdicion: boolean = false;
  @Input() labelCrear: string = 'Registrar';
  @Input() labelEditar: string = 'Modificar';
  @Input() estadoControl?: FormControl<any> | null;
  @Input() mostrarEstado: boolean = false;
}

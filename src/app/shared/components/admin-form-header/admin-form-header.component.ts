import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-admin-form-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-form-header.component.html',
  styleUrls: ['./admin-form-header.component.scss'],
})
export class AdminFormHeaderComponent {
  @Input() icon: string = '';
  @Input() titulo: string = '';
  @Input() modoEdicion: boolean = false;
  @Input() labelCrear: string = 'Registrar';
  @Input() labelEditar: string = 'Modificar';
  @Input() estadoControl?: FormControl<boolean> | AbstractControl | null;
  @Input() mostrarEstado: boolean = false;
}

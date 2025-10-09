import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Time } from '@angular/common';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-form-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-cita.component.html',
  styleUrls: ['./form-cita.component.scss'],
})
export class FormCitaComponent implements OnInit {
  @Output() citaCreada = new EventEmitter<Cita>();
  @Output() close = new EventEmitter<void>();
  @Input() fecha: Date | null = null;
  @Input() horaInicio: string | null = null;
  @Input() horaFin: string | null = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fecha: [{ value: '', disabled: true }, Validators.required],
      horaInicio: [{ value: '', disabled: true }, Validators.required],
      horaFin: [{ value: '', disabled: true }, Validators.required],
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
      notas: [''],
      mascotaId: ['', Validators.required],
      veterinarioId: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.fecha) {
      const fechaStr =
        this.fecha instanceof Date ? this.fecha.toISOString().slice(0, 10) : this.fecha;
      this.form.patchValue({ fecha: fechaStr });
    }
    if (this.horaInicio) {
      this.form.patchValue({ horaInicio: this.horaInicio });
    }
    if (this.horaFin) {
      this.form.patchValue({ horaFin: this.horaFin });
    }
  }

  submit() {
    if (this.form.valid) {
      const cita: Cita = {
        ...this.form.getRawValue(),
        estadoActivo: true,
      };
      this.citaCreada.emit(cita);
    }
  }
}

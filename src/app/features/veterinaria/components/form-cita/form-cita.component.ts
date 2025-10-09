import { TipoCita } from '../../models/enums/tipo-cita.enum';
import { EstadoCita } from '../../models/enums/estado-cita.enum';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cita } from '../../models/cita.model';
import { MascotaSelectorComponent } from '../../../../shared/components/mascota-selector/mascota-selector.component';
import { VeterinarioSelectorComponent } from '../../../../shared/components/veterinario-selector/veterinario-selector.component';

@Component({
  selector: 'app-form-cita',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MascotaSelectorComponent,
    VeterinarioSelectorComponent,
  ],
  templateUrl: './form-cita.component.html',
  styleUrls: ['./form-cita.component.scss'],
})
export class FormCitaComponent implements OnInit {
  tipoCitaOptions = [
    { value: TipoCita.Consulta, label: 'Consulta' },
    { value: TipoCita.Control, label: 'Control' },
    { value: TipoCita.Cirugia, label: 'Cirugía' },
    { value: TipoCita.Tratamiento, label: 'Tratamiento' },
    { value: TipoCita.Examen, label: 'Exámen' },
  ];

  estadoCitaOptions = [
    { value: EstadoCita.Pendiente, label: 'Pendiente' },
    { value: EstadoCita.Confirmada, label: 'Confirmada' },
    { value: EstadoCita.Cancelada, label: 'Cancelada' },
    { value: EstadoCita.Completada, label: 'Completada' },
    { value: EstadoCita.Reprogramada, label: 'Reprogramada' },
  ];
  @Output() citaCreada = new EventEmitter<Cita>();
  @Output() close = new EventEmitter<void>();
  @Input() fecha: Date | null = null;
  @Input() horaInicio: string | null = null;
  @Input() horaFin: string | null = null;
  form: FormGroup;
  duenos = [
    { id: '1', nombre: 'Juan Pérez' },
    { id: '2', nombre: 'Ana Gómez' },
  ];
  mascotas = [
    { id: 'a', nombre: 'Firulais', duenoId: '1' },
    { id: 'b', nombre: 'Michi', duenoId: '2' },
  ];
  veterinarios = [
    { id: 'v1', nombre: 'Dr. López' },
    { id: 'v2', nombre: 'Dra. Martínez' },
  ];

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

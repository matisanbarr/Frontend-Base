import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaBotonComponent } from '../../../components/tarjeta-boton/tarjeta-boton.component';
import { CalendarComponent } from '../../../components/calendario/calendar.component';
import { FormCitaComponent } from '../../../components/form-cita/form-cita.component';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, TarjetaBotonComponent, CalendarComponent, FormCitaComponent],
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.css'],
})
export class CitaPage implements OnInit {
  calendarOptions = {
    initialView: 'timeGridDay',
    headerToolbar: {
      left: 'prev,next today', // ← botones para cambiar de día
      center: 'title',
      right: '',
    },
    selectable: true, // Permite seleccionar horarios
  };

  mostrarFormulario = false;
  datosSeleccionados: { fecha: Date; horaInicio: string; horaFin: string; allDay: boolean } | null =
    null;

  constructor() {}

  ngOnInit() {}

  abrirFormulario(evento: { date: Date; allDay: boolean; end?: Date }) {
    console.log('abrirFormulario llamado', evento);
    this.mostrarFormulario = true;
    // Si el calendario provee end, úsalo, si no, suma 15 minutos a start
    const fecha = evento.date;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const horaInicio = pad(fecha.getHours()) + ':' + pad(fecha.getMinutes());
    let horaFin = '';
    if (evento.end) {
      horaFin = pad(evento.end.getHours()) + ':' + pad(evento.end.getMinutes());
    } else {
      // Sumar 15 minutos
      const fin = new Date(fecha.getTime() + 15 * 60000);
      horaFin = pad(fin.getHours()) + ':' + pad(fin.getMinutes());
    }
    this.datosSeleccionados = {
      fecha,
      horaInicio,
      horaFin,
      allDay: evento.allDay,
    };
    console.log('mostrarFormulario:', this.mostrarFormulario);
  }

  guardarCita(cita: any) {
    this.mostrarFormulario = false;
    this.datosSeleccionados = null;
    // Aquí puedes guardar la cita
  }

  cerrarModal() {
    this.mostrarFormulario = false;
    this.datosSeleccionados = null;
  }
}

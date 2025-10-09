import { Component, OnInit } from '@angular/core';
import { TarjetaBotonComponent } from '../../../components/tarjeta-boton/tarjeta-boton.component';
import { NgTemplateOutlet } from '@angular/common';
import { GestorDuenoComponent } from './gestor-dueno/gestor-dueno.component';
import { GestorMascotaComponent } from './gestor-mascota/gestor-mascota.component';
import { HistorialMascotaComponent } from './historial-mascota/historial-mascota.component';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [
    TarjetaBotonComponent,
    NgTemplateOutlet,
    GestorDuenoComponent,
    GestorMascotaComponent,
    HistorialMascotaComponent,
  ],
  templateUrl: './paciente.page.html',
  styleUrls: ['./paciente.page.css'],
})
export class PacientePage implements OnInit {
  vistaActual: number = 0;
  constructor() {}

  ngOnInit() {}

  cambiarVista(vista: number) {
    this.vistaActual = vista;
  }
}

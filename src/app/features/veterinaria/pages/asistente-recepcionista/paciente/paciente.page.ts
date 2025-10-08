import { Component, OnInit } from '@angular/core';
import { TarjetaBotonComponent } from '../../../components/tarjeta-boton/tarjeta-boton.component';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [TarjetaBotonComponent],
  templateUrl: './paciente.page.html',
  styleUrls: ['./paciente.page.css'],
})
export class PacientePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}

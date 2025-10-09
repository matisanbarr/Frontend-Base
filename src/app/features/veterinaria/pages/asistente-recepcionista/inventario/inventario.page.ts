import { Component, OnInit } from '@angular/core';
import { TarjetaBotonComponent } from '../../../components/tarjeta-boton/tarjeta-boton.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [TarjetaBotonComponent],
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.css'],
})
export class InventarioPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}

import { Component, OnInit } from '@angular/core';
import { TarjetaBotonComponent } from '../../../components/tarjeta-boton/tarjeta-boton.component';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [TarjetaBotonComponent],
  templateUrl: './facturacion.page.html',
  styleUrls: ['./facturacion.page.scss'],
})
export class FacturacionPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mascota } from '../models/mascota.model';

@Component({
  selector: 'veterinaria-mascota-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mascota-card">
      <h3>{{ mascota.nombre }}</h3>
      <p>Especie: {{ mascota.especie }}</p>
      <p *ngIf="mascota.raza">Raza: {{ mascota.raza }}</p>
      <p *ngIf="mascota.edad">Edad: {{ mascota.edad }} años</p>
    </div>
  `,
  styles: [
    `
      .mascota-card {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class MascotaCardComponent {
  @Input() mascota!: Mascota;
}

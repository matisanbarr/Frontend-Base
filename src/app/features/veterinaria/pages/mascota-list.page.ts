import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../services/mascota.service';
import { Mascota } from '../models/mascota.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'veterinaria-mascota-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Lista de Mascotas</h2>
    <ul>
      <li *ngFor="let mascota of mascotas$ | async">
        {{ mascota.nombre }} ({{ mascota.especie }})
      </li>
    </ul>
  `,
})
export class MascotaListPage {
  mascotas$: Observable<Mascota[]>;

  constructor(private mascotaService: MascotaService) {
    this.mascotas$ = this.mascotaService.getMascotas();
  }
}

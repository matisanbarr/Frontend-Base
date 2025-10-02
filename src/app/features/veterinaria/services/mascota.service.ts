import { Injectable } from '@angular/core';
import { Mascota } from '../models/mascota.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private mascotas: Mascota[] = [
    { id: '1', nombre: 'Firulais', especie: 'Perro', propietarioId: '1' },
    { id: '2', nombre: 'Misu', especie: 'Gato', propietarioId: '2' },
  ];

  getMascotas(): Observable<Mascota[]> {
    return of(this.mascotas);
  }

  getMascotaById(id: string): Observable<Mascota | undefined> {
    return of(this.mascotas.find((m) => m.id === id));
  }

  agregarMascota(mascota: Mascota): void {
    this.mascotas.push(mascota);
  }
}

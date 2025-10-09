import { Time } from '@angular/common';

export interface Cita {
  id?: string;
  fecha: string | Date;
  horaInicio: string | Time;
  horaFin: string | Time;
  tipo: string;
  estado: string;
  notas: string;
  mascotaId: string;
  veterinarioId: string;
  tenantId: string;
  estadoActivo: boolean;
}

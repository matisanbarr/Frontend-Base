import { Mascota } from './mascota.model';

export interface Dueno {
  id?: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  tenantId: string;
  estadoActivo: boolean;
  mascotas: Mascota[];
}

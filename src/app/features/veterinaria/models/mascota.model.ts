import { HistorialMedico } from './historial-medico.model';
import { Cita } from './cita.model';
import { Dueno } from './dueno.model';
import { Raza } from './raza.model';

export interface Mascota {
  id?: string;
  nombre: string;
  sexo: string;
  fechaNacimiento?: string | Date;
  color: string;
  observaciones: string;
  razaId: string;
  raza?: Raza;
  historialesMedicos: HistorialMedico[];
  citas: Cita[];
}

import { HistorialMedico } from './historial-medico.model';
import { Cita } from './cita.model';

export interface Mascota {
  id?: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fechaNacimiento?: string | Date;
  color: string;
  observaciones: string;
  duenoId: string;
  tenantId: string;
  estadoActivo: boolean;
  historialesMedicos: HistorialMedico[];
  citas: Cita[];
}

import { Raza } from './raza.model';

export interface Especie {
  id?: string;
  nombre: string;
  razas: Raza[];
}

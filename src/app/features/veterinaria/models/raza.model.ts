import { Especie } from './especie.model';

export interface Raza {
  id?: string;
  nombre: string;
  especieId: string;
  especie?: Especie;
}

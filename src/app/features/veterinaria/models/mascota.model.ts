export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
  propietarioId: string;
}

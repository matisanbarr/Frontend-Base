export interface Cita {
  id?: string;
  fechaHora: string | Date;
  tipo: string;
  estado: string;
  notas: string;
  mascotaId: string;
  veterinarioId: string;
  tenantId: string;
  estadoActivo: boolean;
}

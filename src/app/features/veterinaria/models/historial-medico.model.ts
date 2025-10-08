export interface HistorialMedico {
  id?: string;
  fecha: string | Date;
  diagnostico: string;
  tratamiento: string;
  notas: string;
  archivosAdjuntos: string;
  mascotaId: string;
  veterinarioId: string;
  tenantId: string;
  estadoActivo: boolean;
}

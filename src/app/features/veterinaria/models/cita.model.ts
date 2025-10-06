/**
 * Modelo para Cita
 * Los campos de fecha pueden recibirse como string (ISO 8601) o Date.
 * Se recomienda convertir siempre con new Date(fecha) antes de mostrar o procesar.
 */
export interface Cita {
  id: string;
  mascotaId: string;
  /** Fecha de la cita (string ISO 8601 o Date) */
  fecha: string | Date;
  motivo: string;
  notas?: string;
}

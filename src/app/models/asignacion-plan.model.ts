/**
 * Modelo para TenantPlan
 * Los campos de fecha pueden recibirse como string (ISO 8601) o Date.
 * Se recomienda convertir siempre con new Date(fecha) antes de mostrar o procesar.
 */
export interface TenantPlan {
  id?: string; // Guid? en C#
  tenantId: string; // Guid
  nombreTenant?: string;
  planId: string; // Guid
  nombrePlan?: string;
  /** Fecha de inicio (string ISO 8601 o Date) */
  fechaInicio?: string | Date;
  /** Fecha de fin (string ISO 8601 o Date) */
  fechaFin?: string | Date;
  activo: boolean;
}

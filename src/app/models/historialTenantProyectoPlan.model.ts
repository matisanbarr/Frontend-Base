import { TenantProyectoPlan } from './tenantProyectoPlan.model';

/**
 * Modelo para HistorialTenantProyectoPlan
 * Los campos de fecha pueden recibirse como string (ISO 8601) o Date.
 * Se recomienda convertir siempre con new Date(fecha) antes de mostrar o procesar.
 */
export interface HistorialTenantProyectoPlan {
  id?: string;
  tenantProyectoPlanId: string;
  tenantProyectoPlan?: TenantProyectoPlan;
  fechaEvento: Date;
  tipoEvento: string; // Ej: "Pago", "Cambio de Plan", "Renovación", "Suspensión"
  descripcion?: string;
  monto?: number; // Si aplica (por ejemplo, para pagos)
  estadoActivo?: boolean;
}

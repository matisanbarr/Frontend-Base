import { TenantProyectoPlan } from './tenantProyectoPlan.model';

/**
 * Modelo para PagoTenantProyectoPlan
 * Los campos de fecha pueden recibirse como string (ISO 8601) o Date.
 * Se recomienda convertir siempre con new Date(fecha) antes de mostrar o procesar.
 */
export interface PagoTenantProyectoPlan {
  id?: string;
  tenantProyectoPlanId: string;
  tenantProyectoPlan?: TenantProyectoPlan;
  fechaPago: Date;
  monto: number;
  observacion?: string;
  estadoActivo?: boolean;
}

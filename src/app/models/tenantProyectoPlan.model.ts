import { Plan } from './plan.model';
import { Proyecto } from './proyecto.model';
import { Tenant } from './tenant.model';

/**
 * Modelo para TenantProyectoPlan
 * Los campos de fecha pueden recibirse como string (ISO 8601) o Date.
 * Se recomienda convertir siempre con new Date(fecha) antes de mostrar o procesar.
 */
export interface TenantProyectoPlan {
  id?: string;
  tenantId: string;
  tenant?: Tenant;
  proyectoId: string;
  proyecto?: Proyecto;
  planId: string;
  plan?: Plan;
  fechaInicio: Date;
  fechaVencimiento: Date;
  renovacionAutomatica: boolean;
  estadoActivo?: boolean;
}

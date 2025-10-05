import { TenantProyectoPlan } from './tenantProyectoPlan.model';

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

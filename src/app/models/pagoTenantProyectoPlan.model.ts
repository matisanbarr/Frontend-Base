import { TenantProyectoPlan } from './tenantProyectoPlan.model';

export interface PagoTenantProyectoPlan {
  id?: string;
  tenantProyectoPlanId: string;
  tenantProyectoPlan?: TenantProyectoPlan;
  fechaPago: Date;
  monto: number;
  observacion?: string;
  estadoActivo?: boolean;
}

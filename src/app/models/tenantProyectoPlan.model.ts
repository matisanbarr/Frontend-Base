import { Plan } from './plan.model';
import { Proyecto } from './proyecto.model';
import { Tenant } from './tenant.model';

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

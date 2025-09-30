export interface TenantPlan {
	id?: string; // Guid? en C#
	tenantId: string; // Guid
	nombreTenant?: string;
	planId: string; // Guid
	nombrePlan?: string;
	fechaInicio: Date;
	fechaFin?: Date;
	activo: boolean;
}
import { Proyecto } from './proyecto.model';
export interface AsignarProyectosTenant {
	tenantId: string;
	proyectoIds: string[];
}

export interface TenantConProyecto {
	tenantId: string;
	tenantNombre: string;
	proyectos: Proyecto[];
}
export interface Tenant {
	id?: string;
	nombre: string;
	correo?: string;
	telefono?: string;
	direccion?: string;
	fechaCreacion: Date;
	activo: boolean;
}
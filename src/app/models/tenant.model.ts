export interface Tenant {
  id?: string;
  nombre: string;
  correo: string;
  rol: string;
  telefono: string;
  direccion?: string;
  estadoActivo?: boolean;
}

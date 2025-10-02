import { Rol } from "./rol.model";

export interface Usuario {
  id?: string | null;
  nombre: string;  
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  password?: string | null;
  email: string;
  fechaNacimiento?: string;
  genero?: number;
  estadoActivo: boolean;
  isGlobal?: boolean;
  tenantId?: string | null;
  roles: Rol[];
}
import { Rol } from './rol.model';

export interface Usuario {
  id?: string | null;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  nombre?: string;
  password?: string;
  email: string;
  fechaNacimiento?: string;
  genero?: number;
  estadoActivo?: boolean;
  isGlobal?: boolean;
  tenantId?: string | null;
  roles?: Rol[];
}

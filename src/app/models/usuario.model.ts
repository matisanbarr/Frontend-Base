import { Rol } from "./rol.model";

export interface Usuario {
  id?: string;
  nombre: string;
  password: string;
  email: string;
  fechaNacimiento?: string;
  genero?: number;
  estadoActivo: boolean;
  roles: Rol[];
}
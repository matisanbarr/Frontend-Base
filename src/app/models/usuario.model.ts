import { Rol } from "./rol.model";

// Modelo de Usuario según tu backend
export interface RegistroUsuario {
  nombreUsuario: string;
  password: string;
  roles: Rol[];
}
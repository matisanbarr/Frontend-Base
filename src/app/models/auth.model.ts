// Modelo para registro de usuario
export interface RegisterUserRequest {
  nombre: string;
  password: string;
  email: string;
  fechaNacimiento?: string;
  genero?: number;
  estadoActivo?: boolean;
  isGlobal?: boolean;
  roles?: Role[];
}

// Modelo para Login Request según tu backend
export interface LoginRequest {
  usuario: string;
  password: string;
}

// Modelo para Login Response
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  tenantId: string;
  isGlobal: boolean;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
}

// Modelo de Rol
export interface Role {
  id?: string; // guid
  nombre: string;
  descripcion?: string;
  isGlobal?: boolean;
}

// Modelo para crear rol
export interface CreateRoleRequest {
  nombre: string;
}

// Modelo para asignar rol a usuario
export interface UsuarioRoleRequest {
  usuarioId: string; // guid
  rolId: string; // guid
}

// Modelo para respuesta de asignación de rol
export interface UsuarioRoleResponse {
  usuarioId: string; // guid
  rolId: string; // guid
}

// Modelo para cambio de contraseña
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
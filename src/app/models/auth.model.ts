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
  nombreUsuario: string;
  password: string;
}

// Modelo para Login/Refresh Response (TokenResponseDto)
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiration: string; // ISO string, se puede convertir a Date si es necesario
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

// Modelo de Usuario según tu backend
export interface User {
  id: string; // guid
  nombreUsuario: string;
  fechaCreacion: string; // datetime ISO 8601
  fechaModificacion?: string; // datetime nullable
}

// Modelo para Login Request según tu backend
export interface LoginRequest {
  nombreUsuario: string;
  password: string;
}

// Modelo para Login Response
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn: number;
}

// Modelo para Register Request según tu backend
export interface RegisterRequest {
  nombreUsuario: string;
  password: string;
}

// Modelo de Rol
export interface Role {
  id: string; // guid
  nombre: string;
  fechaCreacion: string; // datetime ISO 8601
  fechaModificacion?: string; // datetime nullable
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
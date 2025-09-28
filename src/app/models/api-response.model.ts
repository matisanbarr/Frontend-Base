// Modelo base para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Modelo para paginación
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Modelo para errores HTTP
export interface HttpError {
  status: number;
  message: string;
  error?: any;
}
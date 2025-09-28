import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, HttpError } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly apiKey = environment.apiKey;

  constructor(private http: HttpClient) {}

  /**
   * Realizar petición GET
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Realizar petición POST
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Realizar petición PUT
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Realizar petición DELETE
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Realizar petición PATCH
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Obtener headers base con API Key
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return headers;
  }

  /**
   * Manejar respuesta de la API
   */
  private handleApiResponse<T>(response: ApiResponse<T>): T {
    if (response.success) {
      return response.data as T;
    } else {
      throw new Error(response.message || 'Error en la respuesta de la API');
    }
  }

  /**
   * Manejar errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let httpError: HttpError = {
      status: error.status,
      message: 'Error desconocido',
      error: error.error
    };

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      httpError.message = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          httpError.message = error.error?.message || 'Solicitud incorrecta';
          break;
        case 401:
          httpError.message = 'No autorizado. Por favor, inicia sesión nuevamente.';
          break;
        case 403:
          httpError.message = 'Acceso denegado. No tienes permisos para realizar esta acción.';
          break;
        case 404:
          httpError.message = 'Recurso no encontrado';
          break;
        case 409:
          httpError.message = error.error?.message || 'Conflicto en la solicitud';
          break;
        case 422:
          httpError.message = error.error?.message || 'Datos de entrada inválidos';
          break;
        case 500:
          httpError.message = 'Error interno del servidor. Intenta más tarde.';
          break;
        default:
          httpError.message = error.error?.message || `Error del servidor: ${error.status}`;
      }
    }

    console.error('Error en ApiService:', httpError);
    return throwError(() => httpError);
  }
}
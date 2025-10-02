import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Solicitud incorrecta';
              break;
            case 401:
              errorMessage = 'No autorizado. Tu sesión ha expirado.';
              break;
            case 403:
              errorMessage = 'Acceso denegado. No tienes permisos suficientes.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 409:
              errorMessage = error.error?.message || 'Ya existe un recurso con estos datos';
              break;
            case 422:
              errorMessage = this.getValidationErrors(error.error);
              break;
            case 500:
              errorMessage = 'Error interno del servidor. Intenta más tarde.';
              break;
            case 0:
              errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
              break;
            default:
              errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
          }
        }

        // Log del error para debugging
        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: error.url,
          error: error.error,
        });

        // Opcional: Mostrar toast/notification del error
        // this.notificationService.showError(errorMessage);

        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          originalError: error,
        }));
      })
    );
  }

  /**
   * Extraer errores de validación del response
   */
  private getValidationErrors(errorResponse: any): string {
    if (errorResponse?.errors) {
      const errors: string[] = [];

      // Si es un objeto con propiedades de error
      if (typeof errorResponse.errors === 'object') {
        Object.keys(errorResponse.errors).forEach((key) => {
          const fieldErrors = errorResponse.errors[key];
          if (Array.isArray(fieldErrors)) {
            errors.push(...fieldErrors);
          } else {
            errors.push(fieldErrors);
          }
        });
      }
      // Si es un array de errores
      else if (Array.isArray(errorResponse.errors)) {
        errors.push(...errorResponse.errors);
      }

      return errors.length > 0 ? errors.join(', ') : 'Datos de entrada inválidos';
    }

    return errorResponse?.message || 'Datos de entrada inválidos';
  }
}

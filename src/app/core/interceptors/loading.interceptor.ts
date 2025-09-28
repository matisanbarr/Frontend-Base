import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No mostrar loading para ciertas peticiones (como refresh token)
    if (this.shouldSkipLoading(req)) {
      return next.handle(req);
    }

    // Mostrar loading
    this.loadingService.show();

    return next.handle(req).pipe(
      finalize(() => {
        // Ocultar loading al finalizar (exitoso o con error)
        this.loadingService.hide();
      })
    );
  }

  /**
   * Determinar si se debe omitir el loading para ciertas peticiones
   */
  private shouldSkipLoading(req: HttpRequest<any>): boolean {
    // No mostrar loading para:
    // - Refresh token
    // - Peticiones de logout
    // - Peticiones con header específico
    return req.url.includes('/auth/refresh') ||
           req.url.includes('/auth/logout') ||
           req.headers.has('X-Skip-Loading');
  }
}
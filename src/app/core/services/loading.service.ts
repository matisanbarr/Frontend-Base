import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  public loading$ = this.loadingSubject.asObservable();

  /**
   * Mostrar indicador de loading
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Ocultar indicador de loading
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }

  /**
   * Obtener estado actual de loading
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Forzar el estado de loading (usar solo si es necesario)
   */
  setLoading(loading: boolean): void {
    this.requestCount = loading ? 1 : 0;
    this.loadingSubject.next(loading);
  }
}

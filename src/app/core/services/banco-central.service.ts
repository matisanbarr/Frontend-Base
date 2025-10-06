import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BancoCentralGetSeriesResponse } from '../../models/compartidos/banco-central.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BancoCentralService {
  private apiUrl = environment.apiUrl + '/bancocentral';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una serie específica del backend
   * @param timeseries Código de la serie (por ejemplo, 'UF')
   * @param firstDate Fecha inicial (opcional, formato yyyy-MM-dd)
   * @param lastDate Fecha final (opcional, formato yyyy-MM-dd)
   */
  getSeries(
    timeseries: string,
    firstDate?: string,
    lastDate?: string
  ): Observable<BancoCentralGetSeriesResponse> {
    let params = new HttpParams().set('timeseries', timeseries);
    if (firstDate) params = params.set('firstDate', firstDate);
    if (lastDate) params = params.set('lastDate', lastDate);
    return this.http.get<BancoCentralGetSeriesResponse>(`${this.apiUrl}/series`, { params });
  }

  /**
   * Obtiene el catálogo de series disponibles por frecuencia
   * @param frequency DAILY, MONTHLY, QUARTERLY, ANNUAL
   */
  getCatalogo(frequency: string): Observable<BancoCentralGetSeriesResponse> {
    const params = new HttpParams().set('frequency', frequency);
    return this.http.get<BancoCentralGetSeriesResponse>(`${this.apiUrl}/catalogo`, { params });
  }
}

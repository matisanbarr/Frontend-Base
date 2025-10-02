import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardSummary } from '../../models/dashboardSummaryDto.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) {}

  infoGlobal(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(this.apiUrl + '/summary');
  }
}

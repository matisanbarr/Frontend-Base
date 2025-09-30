import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterUserRequest } from '../../models/auth.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(data: RegisterUserRequest): Observable<any> {
    // No enviar tenantId, el backend lo asigna automáticamente
    return this.http.post<any>(`${environment.apiUrl}/usuarios`, data);
  }
}

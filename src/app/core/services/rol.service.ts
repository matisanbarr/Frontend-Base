import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Rol {
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = environment.apiUrl + '/roles';

  constructor(private http: HttpClient) {}

  listarRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  crearRol(rol: Rol): Observable<any> {
    return this.http.post(this.apiUrl, rol);
  }

  eliminarRol(nombre: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${nombre}`);
  }
}

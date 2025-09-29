import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rol } from '../../models/rol.model';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = environment.apiUrl + '/roles';

  constructor(private http: HttpClient) {}

  crearRol(rol: Rol): Observable<any> {
    return this.http.post(this.apiUrl, rol);
  }

  modificarRol(rol: Rol): Observable<any> {
    return this.http.put(this.apiUrl, rol);
  }

  listarRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }  

  eliminarRol(nombre: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${nombre}`);
  }

  listarPaginadoRoles(paginacion: PaginacionDto): Observable<RespuestaPaginadaDto> {
    return this.http.get<RespuestaPaginadaDto>(this.apiUrl + '/lista-paginada', { params: paginacion as any });
  }
}

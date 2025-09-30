import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { Plan } from '../../models/plan.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = environment.apiUrl + '/planes';

  constructor(private http: HttpClient) {}

  crearPlan(plan: Plan): Observable<any> {
    return this.http.post(this.apiUrl, plan);
  }

  modificarPlan(plan: Plan): Observable<any> {
    return this.http.put(this.apiUrl, plan);
  }

  listarPlanes(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }

  eliminarPlan(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarPaginadoPlanes(paginacion: PaginacionDto): Observable<RespuestaPaginadaDto> {
    return this.http.get<RespuestaPaginadaDto>(this.apiUrl + '/lista-paginada', { params: paginacion as any });
  }
}

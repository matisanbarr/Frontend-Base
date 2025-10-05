import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginadaDto } from '../../models/compartidos';
import { Plan } from '../../models/plan.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private apiUrl = environment.apiUrl + '/planes';

  constructor(private http: HttpClient) {}

  crearPlan(plan: Plan): Observable<Respuesta<any>> {
    return this.http.post<Respuesta<any>>(this.apiUrl, plan);
  }

  modificarPlan(plan: Plan): Observable<Respuesta<any>> {
    return this.http.put<Respuesta<any>>(this.apiUrl, plan);
  }

  listarPlanes(): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl + '/listar-todo');
  }

  eliminarPlan(id: string): Observable<Respuesta<any>> {
    return this.http.delete<Respuesta<any>>(`${this.apiUrl}/${id}`);
  }

  listarPaginadoPlanes(paginacion: PaginacionDto): Observable<Respuesta<any>> {
    return this.http.get<Respuesta<any>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

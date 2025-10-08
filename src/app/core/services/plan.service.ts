import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginacionDto } from '../../models/compartidos/paginadoDto.model';
import { RespuestaPaginada } from '../../models/compartidos';
import { Plan } from '../../models/plan.model';
import { Respuesta } from '../../models/compartidos/respuesta.model';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private apiUrl = environment.apiUrl + '/planes';

  constructor(private http: HttpClient) {}

  crearPlan(plan: Plan): Observable<Respuesta<boolean>> {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, plan);
  }

  modificarPlan(plan: Plan): Observable<Respuesta<boolean>> {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, plan);
  }

  listarPlanes(): Observable<Respuesta<Plan[]>> {
    return this.http.get<Respuesta<Plan[]>>(this.apiUrl + '/listar-todo');
  }

  eliminarPlan(id: string): Observable<Respuesta<boolean>> {
    return this.http.delete<Respuesta<boolean>>(`${this.apiUrl}/${id}`);
  }

  listarPaginadoPlanes(paginacion: PaginacionDto): Observable<Respuesta<RespuestaPaginada>> {
    return this.http.get<Respuesta<RespuestaPaginada>>(this.apiUrl, {
      params: paginacion as any,
    });
  }
}

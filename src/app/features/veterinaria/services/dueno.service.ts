import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';
import { Respuesta } from '../../../models/compartidos/respuesta.model';
import { RespuestaPaginada } from '../../../models/compartidos/respuestaPaginadaDto.model';
import { Dueno } from '../models/dueno.model';
import { Mascota } from '../models/mascota.model';

@Injectable({ providedIn: 'root' })
export class DuenoService {
  apiUrl = environment.apiUrl + '/dueno';

  constructor(private http: HttpClient) {}

  listarTodo() {
    return this.http.get<Respuesta<Dueno[]>>(this.apiUrl);
  }

  duenoPorId(id: string) {
    return this.http.get<Respuesta<Dueno>>(this.apiUrl + `/${id}`);
  }

  crear(dto: Dueno) {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, dto);
  }

  modificar(dto: Dueno) {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, dto);
  }

  eliminar(id: string) {
    return this.http.delete<Respuesta<boolean>>(this.apiUrl + `/${id}`);
  }

  listarTodoPaginado(paginacion: PaginacionDto) {
    return this.http.post<Respuesta<RespuestaPaginada>>(this.apiUrl, paginacion);
  }

  agregarOModificarMascotas(duenoId: string, mascotas: Mascota[]) {
    return this.http.post<Respuesta<boolean>>(`${this.apiUrl}/${duenoId}/mascotas`, mascotas);
  }

  eliminarMascotas(duenoId: string, mascotaIds: string[]) {
    return this.http.request<Respuesta<boolean>>('delete', `${this.apiUrl}/${duenoId}/mascotas`, {
      body: mascotaIds,
    });
  }
}

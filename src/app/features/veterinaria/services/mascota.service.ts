import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Mascota } from '../models/mascota.model';
import { PaginacionDto } from '../../../models/compartidos/paginadoDto.model';
import { Respuesta } from '../../../models/compartidos/respuesta.model';
import { RespuestaPaginada } from '../../../models/compartidos/respuestaPaginadaDto.model';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  apiUrl = environment.apiUrl + '/mascota';

  constructor(private http: HttpClient) {}

  listarTodo() {
    return this.http.get<Respuesta<Mascota[]>>(this.apiUrl);
  }

  mascotaPorId(id: string) {
    return this.http.get<Respuesta<Mascota>>(this.apiUrl + `/${id}`);
  }

  crear(dto: Mascota) {
    return this.http.post<Respuesta<boolean>>(this.apiUrl, dto);
  }

  modificar(dto: Mascota) {
    return this.http.put<Respuesta<boolean>>(this.apiUrl, dto);
  }

  eliminar(id: string) {
    return this.http.delete<Respuesta<boolean>>(this.apiUrl + `/${id}`);
  }

  listarTodoPaginado(paginacion: PaginacionDto) {
    return this.http.post<Respuesta<RespuestaPaginada>>(this.apiUrl, paginacion);
  }

  listarMascotasPorDueno(duenoId: string) {
    return this.http.get<Respuesta<Mascota[]>>(this.apiUrl + `/dueno/${duenoId}`);
  }
}

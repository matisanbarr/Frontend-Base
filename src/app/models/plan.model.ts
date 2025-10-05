export interface Plan {
  id?: string;
  nombre: string;
  descripcion?: string;
  precioUfPorProyecto: number;
  maximoUsuariosPorProyecto: number;
  estadoActivo: boolean;
}

export interface Plan {
  id?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  maximoUsuarios: number;
  fechaCreacion: Date;
  fechaModificacion?: Date;
  estaActivo: boolean;
}

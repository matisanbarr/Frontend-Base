export interface Respuesta<T> {
  codigoRespuesta: number;
  glosaRespuesta: string;
  respuesta?: T;
}

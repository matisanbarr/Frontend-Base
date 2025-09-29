export class PaginacionDto {
  pagina: number = 1;
  tamano: number = 10;
  ordenPor?: string;
  descendente: boolean = false;
  filtro?: string;

  constructor(init?: Partial<PaginacionDto>) {
    Object.assign(this, init);
  }
}
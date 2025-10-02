import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaLarga', standalone: true })
export class FechaLargaPipe implements PipeTransform {
  private meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  transform(value: Date | string | undefined | null): string {
    if (!value) return '';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(new Date(d).getTime())) return '';
    const date = new Date(d);
    return `${date.getDate()} ${this.meses[date.getMonth()]} ${date.getFullYear()}`;
  }
}

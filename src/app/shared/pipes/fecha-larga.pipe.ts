import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para mostrar fechas en formato largo en español.
 * Soporta valores Date o string en formato ISO 8601 (con Z o offset).
 * Convierte siempre el valor a Date antes de mostrar.
 */
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
    // Siempre convertir a Date
    const date = typeof value === 'string' ? new Date(value) : value;
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return `${date.getDate()} ${this.meses[date.getMonth()]} ${date.getFullYear()}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleColor',
  standalone: true,
})
export class RoleColorPipe implements PipeTransform {
  private colorClasses = [
    'bg-primary',
    'bg-success',
    'bg-warning',
    'bg-danger',
    'bg-info',
    'bg-secondary',
    'bg-dark',
    'bg-light',
    'bg-purple',
    'bg-orange',
  ];

  transform(rolNombre: string, rolesDisponibles: any[]): string {
    const idx = rolesDisponibles.findIndex((r) => r.nombre === rolNombre);
    if (idx === -1) return 'bg-info';
    return this.colorClasses[idx % this.colorClasses.length];
  }
}

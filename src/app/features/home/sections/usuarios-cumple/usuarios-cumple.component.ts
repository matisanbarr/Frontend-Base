import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios-cumple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-cumple.component.html',
  styleUrls: ['./usuarios-cumple.component.scss'],
})
export class UsuariosCumpleComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error: string | null = null;
  private usuarioService = inject(UsuarioService);

  calcularEdad(fechaNacimiento: string | undefined): number | null {
    if (!fechaNacimiento) return null;
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  ngOnInit(): void {
    this.cargarCumpleanios();
  }

  cargarCumpleanios(dias: number = 7): void {
    this.loading = true;
    this.error = null;
    this.usuarioService.proximosCumpleaños(dias).subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (_err: unknown) => {
        this.error = 'No se pudieron cargar los cumpleaños.';
        this.loading = false;
      },
    });
  }
}

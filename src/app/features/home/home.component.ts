import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmpresasSuscripcionComponent } from './sections/empresas-suscripcion/empresas-suscripcion.component';
import { UsuariosCumpleComponent } from './sections/usuarios-cumple/usuarios-cumple.component';
import { MiniCardsComponent } from './sections/mini-cards/mini-cards.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EmpresasSuscripcionComponent,
    UsuariosCumpleComponent,
    MiniCardsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @Input() isAdminGlobal: boolean | null = null;
  @Input() userName: string | null = null;
  homeImageExists = false;

  constructor() {}
}

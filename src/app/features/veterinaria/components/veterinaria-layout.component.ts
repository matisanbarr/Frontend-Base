import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-veterinaria-layout',
  templateUrl: './veterinaria-layout.component.html',
  standalone: true,
  imports: [RouterOutlet],
})
export class VeterinariaLayoutComponent {
  isAdminGlobal: boolean = false;

  constructor() {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        const currentUser = JSON.parse(userStr);
        const roles = currentUser?.roles || [];
        this.isAdminGlobal = Array.isArray(roles) && roles.includes('Admin Global');
      } catch {}
    }
  }
}

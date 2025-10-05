import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TenantPlan } from '../../../../models/asignacion-plan.model';

@Component({
  selector: 'app-empresas-suscripcion',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './empresas-suscripcion.component.html',
  styleUrls: ['./empresas-suscripcion.component.scss'],
})
export class EmpresasSuscripcionComponent implements OnInit {
  tenantPlanes: TenantPlan[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {}
}

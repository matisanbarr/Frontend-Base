import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DashboardSummary } from '../../../../models/dashboardSummaryDto.model';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-mini-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-cards.component.html',
  styleUrls: ['./mini-cards.component.scss'],
})
export class MiniCardsComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  summary?: DashboardSummary;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.dashboardService.infoGlobal().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (_err) => {
        this.error = 'No se pudo cargar el resumen.';
        this.loading = false;
      },
    });
  }
}

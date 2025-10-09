import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-alert-global',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 1055; width: 350px;">
      <div
        *ngFor="let alert of alertService.getAlerts()"
        class="alert alert-{{ alert.type }} alert-dismissible fade show"
        role="alert"
      >
        {{ alert.message }}
        <button type="button" class="btn-close" (click)="alertService.clear()"></button>
      </div>
    </div>
  `,
})
export class AlertGlobalComponent {
  constructor(public alertService: AlertService) {}
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
      <div
        *ngFor="let alert of alerts"
        class="toast align-items-center text-bg-{{ alert.type }} border-0 show mb-2"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ alert.message }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            (click)="close(alert)"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-container {
        max-width: 100vw;
        width: 350px;
      }
      @media (max-width: 768px) {
        .toast-container {
          width: 90vw;
          right: 50%;
          transform: translateX(50%);
          left: 0;
        }
      }
      @media (max-width: 480px) {
        .toast-container {
          width: 98vw;
          right: 50%;
          transform: translateX(50%);
          left: 0;
          top: 0.5rem;
          padding: 0.5rem;
        }
        .toast {
          font-size: 0.95rem;
        }
      }
    `,
  ],
})
export class ToastAlertsComponent {
  @Input() alerts: { type: string; message: string }[] = [];

  close(alert: { type: string; message: string }) {
    const idx = this.alerts.indexOf(alert);
    if (idx > -1) this.alerts.splice(idx, 1);
  }
}

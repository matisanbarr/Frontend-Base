import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alerts: { type: string; message: string }[] = [];

  getAlerts() {
    return this.alerts;
  }

  success(message: string) {
    this.addAlert('success', message);
  }

  error(message: string) {
    this.addAlert('danger', message);
  }

  info(message: string) {
    this.addAlert('info', message);
  }

  warning(message: string) {
    this.addAlert('warning', message);
  }

  clear() {
    this.alerts = [];
  }

  private addAlert(type: string, message: string) {
    this.alerts.push({ type, message });
    setTimeout(() => {
      this.alerts.shift();
    }, 4000);
  }
}

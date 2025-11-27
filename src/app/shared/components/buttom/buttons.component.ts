import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonSize = 'sm' | 'lg';
type RoundedOpt = false | 0 | 1 | 2 | 3 | 'sm' | 'md' | 'lg' | 'xl' | 'pill';
type IconPosition = 'left' | 'right' | 'only';
type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-light'
  | 'outline-dark';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent {
  // Básicos
  @Input() type: ButtonType = 'button';
  @Input() disabled = false;

  // Estilos
  @Input() variant: Variant = 'primary'; // mapea a 'btn btn-{variant}'
  @Input() btnClass?: string; // sobrescribe completamente variant si se pasa
  @Input() extraClass?: string;
  @Input() size?: ButtonSize; // sm | lg
  @Input() block = false; // w-100
  @Input() rounded: RoundedOpt = false;

  // Ícono
  @Input() icon?: string; // clase fontawesome/bootstrap icons
  @Input() iconPosition: IconPosition = 'left';

  // Estado
  @Input() loading = false;
  @Input() preventDoubleClick = false; // bloquea tras click hasta que se libere manualmente

  // Bootstrap data attributes
  @Input() dataBsToggle?: string;
  @Input() dataBsTarget?: string;
  @Input() dataBsDismiss?: string;

  // Accesibilidad / tooltip
  @Input() title?: string | null;
  @Input() ariaLabel?: string | null;

  // Eventos
  @Output() clicked = new EventEmitter<MouseEvent>();

  // Estado interno para doble clic
  internalLocked = false;

  // Señales (opcional si usas Angular signals; si no, podrías usar getters)
  private _classList = signal<string[]>([]);

  // Computed de clases
  classList = computed(() => {
    const classes: string[] = [];

    // Variante vs btnClass
    if (this.btnClass) {
      classes.push(this.btnClass);
    } else {
      classes.push('btn', `btn-${this.variant}`);
    }

    if (this.extraClass) {
      classes.push(this.extraClass);
    }
    if (this.size) {
      classes.push(`btn-${this.size}`);
    }
    if (this.block) {
      classes.push('w-100');
    }

    // Redondeado
    switch (this.rounded) {
      case 'md':
        classes.push('rounded');
        break;
      case 0:
        classes.push('rounded-0');
        break;
      case 1:
      case 'sm':
        classes.push('rounded-1');
        break;
      case 2:
      case 'lg':
        classes.push('rounded-2');
        break;
      case 3:
      case 'xl':
        classes.push('rounded-3');
        break;
      case 'pill':
        classes.push('rounded-pill');
        break;
    }

    return classes;
  });

  get iconOnly(): boolean {
    return this.icon !== undefined && this.iconPosition === 'only';
  }

  handleClick(ev: MouseEvent) {
    if (this.preventDoubleClick) {
      if (this.internalLocked) return;
      this.internalLocked = true;
    }
    this.clicked.emit(ev);
  }

  // Método para liberar bloqueo manualmente desde el padre si se usa preventDoubleClick
  unlock() {
    this.internalLocked = false;
  }
}

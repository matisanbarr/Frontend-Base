import { Component, Output, EventEmitter, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-veterinario-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veterinario-selector.component.html',
  styleUrls: ['./veterinario-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VeterinarioSelectorComponent),
      multi: true,
    },
  ],
})
export class VeterinarioSelectorComponent implements ControlValueAccessor {
  @Input() veterinarios: any[] = [];
  @Output() veterinarioSeleccionado = new EventEmitter<any>();

  value: string | null = null;
  onChange = (value: any) => {};
  onTouched = () => {};

  filteredVeterinarios: any[] = [];

  ngOnInit() {
    // Mostrar todos los veterinarios por defecto
    this.filteredVeterinarios = this.veterinarios;
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value?.toLowerCase() || '';
    // Simulación: filtra veterinarios por nombre (rellena veterinarios[] manualmente para pruebas)
    this.filteredVeterinarios = this.veterinarios.filter((v) =>
      v.nombre.toLowerCase().includes(term)
    );
  }

  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    const vet = this.filteredVeterinarios.find((v) => v.id === id);
    if (vet) {
      this.seleccionarVeterinario(vet);
    }
  }

  seleccionarVeterinario(vet: any) {
    this.value = vet.id;
    this.veterinarioSeleccionado.emit(vet);
    this.onChange(vet.id);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

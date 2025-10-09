import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-mascota-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mascota-selector.component.html',
  styleUrls: ['./mascota-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MascotaSelectorComponent),
      multi: true,
    },
  ],
})
export class MascotaSelectorComponent implements ControlValueAccessor {
  @Input() duenos: any[] = [];
  @Input() mascotas: any[] = [];
  @Output() duenoSeleccionado = new EventEmitter<any>();
  @Output() mascotaSeleccionada = new EventEmitter<any>();

  value: string | null = null;
  onChange = (value: any) => {};
  onTouched = () => {};

  selectedDueno: any = null;
  filteredMascotas: any[] = [];

  filteredDuenos: any[] = [];

  ngOnInit() {
    this.filteredDuenos = this.duenos;
  }

  onSearchDueno(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value?.toLowerCase() || '';
    this.filteredDuenos = this.duenos.filter((d) => d.nombre.toLowerCase().includes(term));
  }

  onSelectDueno(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    const dueno = this.filteredDuenos.find((d) => d.id === id);
    if (dueno) {
      this.seleccionarDueno(dueno);
    }
  }

  onSelectMascota(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    const mascota = this.filteredMascotas.find((m) => m.id === id);
    if (mascota) {
      this.seleccionarMascota(mascota);
    }
  }

  seleccionarDueno(dueno: any) {
    this.selectedDueno = dueno;
    this.duenoSeleccionado.emit(dueno);
    // Filtrar mascotas por dueño
    this.filteredMascotas = this.mascotas.filter((m) => m.duenoId === dueno.id);
    this.writeValue(null);
  }

  seleccionarMascota(mascota: any) {
    this.value = mascota.id;
    this.mascotaSeleccionada.emit(mascota);
    this.onChange(mascota.id);
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

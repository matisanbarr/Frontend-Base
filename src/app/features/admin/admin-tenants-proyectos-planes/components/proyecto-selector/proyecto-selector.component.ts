import { Component, EventEmitter, inject, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ProyectoService } from '../../../../../core/services';
import { Proyecto } from '../../../../../models';

@Component({
  selector: 'app-proyecto-selector',
  standalone: true,
  templateUrl: './proyecto-selector.component.html',
  styleUrls: ['./proyecto-selector.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProyectoSelectorComponent),
      multi: true,
    },
  ],
})
export class ProyectoSelectorComponent implements ControlValueAccessor {
  proyectos: Proyecto[] = [];
  search = new FormControl('');
  loading = false;
  value: string | null = null;
  onChange = (value: any) => {};
  onTouched = () => {};

  private readonly proyectoService = inject(ProyectoService);

  constructor() {
    this.search.valueChanges.pipe(debounceTime(300)).subscribe((value: string | null) => {
      this.buscarProyectos(value ?? '');
    });
    this.buscarProyectos('');
  }

  buscarProyectos(filtro: string) {
    this.loading = true;
    this.proyectoService
      .listarPaginadoProyectos({ pagina: 1, tamano: 10, filtro } as any)
      .subscribe({
        next: (resp: any) => {
          this.proyectos = resp.respuesta?.datos || [];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  seleccionarProyecto(id: string) {
    this.value = id;
    this.onChange(id);
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
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.search.disable();
    } else {
      this.search.enable();
    }
  }
}

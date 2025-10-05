import { Component, EventEmitter, inject, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { PlanService } from '../../../../../core/services';
import { Plan } from '../../../../../models';

@Component({
  selector: 'app-plan-selector',
  standalone: true,
  templateUrl: './plan-selector.component.html',
  styleUrls: ['./plan-selector.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlanSelectorComponent),
      multi: true,
    },
  ],
})
export class PlanSelectorComponent implements ControlValueAccessor {
  planes: Plan[] = [];
  search = new FormControl('');
  loading = false;
  value: string | null = null;
  onChange = (value: any) => {};
  onTouched = () => {};

  private readonly planService = inject(PlanService);

  constructor() {
    this.search.valueChanges.pipe(debounceTime(300)).subscribe((value: string | null) => {
      this.buscarPlanes(value ?? '');
    });
    this.buscarPlanes('');
  }

  buscarPlanes(filtro: string) {
    this.loading = true;
    this.planService.listarPaginadoPlanes({ pagina: 1, tamano: 10, filtro } as any).subscribe({
      next: (resp: any) => {
        this.planes = resp.respuesta?.datos || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  seleccionarPlan(id: string) {
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

import { Component, EventEmitter, Output, OnInit, inject, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Tenant } from '../../../../../models';
import { TenantService } from '../../../../../core/services';

@Component({
  selector: 'app-tenant-selector',
  standalone: true,
  templateUrl: './tenant-selector.component.html',
  styleUrls: ['./tenant-selector.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TenantSelectorComponent),
      multi: true,
    },
  ],
})
export class TenantSelectorComponent implements OnInit, ControlValueAccessor {
  tenants: Tenant[] = [];
  search = new FormControl('');
  loading = false;
  value: string | null = null;
  onChange = (value: any) => {};
  onTouched = () => {};

  private readonly tenantService = inject(TenantService);

  constructor() {}

  ngOnInit() {
    this.search.valueChanges.pipe(debounceTime(300)).subscribe((value: string | null) => {
      this.buscarTenants(value ?? '');
    });
    this.buscarTenants('');
  }

  buscarTenants(filtro: string) {
    this.loading = true;
    this.tenantService.listarTenants().subscribe({
      next: (resp: any) => {
        this.tenants = resp.respuesta || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  seleccionarTenant(id: string) {
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

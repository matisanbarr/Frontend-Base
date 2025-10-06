import { Component, EventEmitter, Output, OnInit, inject, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Tenant } from '../../../../../models';
import { TenantService } from '../../../../../core/services';
import { TenantProyectoPlanService } from '../../../../../core/services/tenant-proyecto-plan.service';
import { TenantProyectoPlan } from '../../../../../models/tenantProyectoPlan.model';

@Component({
  selector: 'app-tenant-proyecto-plan-selector',
  standalone: true,
  templateUrl: './tenants-proyectos-planes-selector.component.html',
  styleUrls: ['./tenants-proyectos-planes-selector.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TenantProyectoPlanSelectorComponent),
      multi: true,
    },
  ],
})
export class TenantProyectoPlanSelectorComponent implements OnInit, ControlValueAccessor {
  tenantsProyectosPlanes: TenantProyectoPlan[] = [];
  search = new FormControl('');
  loading = false;
  value: TenantProyectoPlan | null = null;
  onChange = (value: any) => {};
  onTouched = () => {};

  private readonly tenantProyectoPlanService = inject(TenantProyectoPlanService);

  constructor() {}

  ngOnInit() {
    this.search.valueChanges.pipe(debounceTime(300)).subscribe((value: string | null) => {
      this.buscarTenants(value ?? '');
    });
  }

  buscarTenants(filtro: string) {
    this.loading = true;
    this.tenantProyectoPlanService.listarTenantsProyectosPlanes().subscribe({
      next: (resp: any) => {
        this.tenantsProyectosPlanes = resp.respuesta || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  seleccionarTenant(item: TenantProyectoPlan) {
    this.value = item;
    this.onChange(item);
    this.onTouched();
  }

  writeValue(value: any): void {
    if (!value) {
      this.value = null;
      return;
    }
    // Si value tiene id, buscar en la lista y seleccionar por id
    if (
      value.id &&
      Array.isArray(this.tenantsProyectosPlanes) &&
      this.tenantsProyectosPlanes.length
    ) {
      const found = this.tenantsProyectosPlanes.find((t) => t.id === value.id);
      this.value = found || value;
    } else {
      this.value = value;
    }
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

import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DuenoService } from '../../../../services/dueno.service';
import { Dueno } from '../../../../models/dueno.model';
import { PaginacionDto, RespuestaPaginada } from '../../../../../../models';
import { AlertService } from '../../../../../../core/services/alert.service';
import { AlertGlobalComponent } from '../../../../../../shared/components/alert-global/alert-global.component';

@Component({
  selector: 'app-gestor-dueno',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AlertGlobalComponent],
  templateUrl: './gestor-dueno.component.html',
  styleUrls: ['./gestor-dueno.component.scss'],
})
export class GestorDuenoComponent implements OnInit {
  @Output() volverMenu = new EventEmitter<number>();
  cargandoLista = false;
  // Variables para la lista, paginación y búsqueda
  duenos: Dueno[] = [];
  totalDuenos = 0;
  paginaActual = 1;
  pageSize = 10;
  busqueda = '';
  paginas: number[] = [];

  // Variables para formulario y edición
  mostrarFormulario = false;
  editando = false;
  duenoActual: any = null;
  duenoForm!: FormGroup;

  // Variables para confirmación de eliminación
  duenoAEliminar: any = null;

  private readonly duenoService = inject(DuenoService);
  public readonly alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  constructor() {}

  ngOnInit() {
    this.cargarDuenos();
  }

  cargarDuenos() {
    this.cargandoLista = true;
    const paginacion = new PaginacionDto({
      pagina: this.paginaActual,
      tamano: this.pageSize,
      filtro: this.busqueda,
    });
    this.duenoService.listarTodoPaginado(paginacion).subscribe({
      next: (resp: any) => {
        // Si código 0 o 1, mostrar lista aunque esté vacía
        if (resp.codigoRespuesta === 0 || resp.codigoRespuesta === 1) {
          const paginada = resp.respuesta as RespuestaPaginada;
          this.duenos = paginada?.datos ?? [];
          this.totalDuenos = paginada?.total ?? 0;
          this.paginas = Array.from(
            { length: Math.ceil(this.totalDuenos / this.pageSize) },
            (_, i) => i + 1
          );
        } else {
          this.duenos = [];
          this.totalDuenos = 0;
          this.paginas = [];
        }
        this.cargandoLista = false;
      },
      error: () => {
        this.duenos = [];
        this.totalDuenos = 0;
        this.paginas = [];
        this.cargandoLista = false;
      },
    });
  }

  buscar() {
    this.paginaActual = 1;
    this.cargarDuenos();
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.cargarDuenos();
  }

  abrirFormulario(dueno?: any) {
    this.mostrarFormulario = true;
    if (dueno) {
      this.editando = true;
      this.duenoActual = { ...dueno };
      this.duenoForm = this.fb.group({
        nombre: [dueno.nombre, [Validators.required, Validators.minLength(3)]],
        telefono: [dueno.telefono, [Validators.required, Validators.pattern('^[0-9]{8,}$')]],
        direccion: [dueno.direccion, [Validators.required, Validators.minLength(5)]],
        email: [dueno.email, [Validators.email]],
      });
    } else {
      this.editando = false;
      this.duenoActual = null;
      this.duenoForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{8,}$')]],
        direccion: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.email]],
      });
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.duenoActual = null;
    this.editando = false;
    this.duenoForm?.reset();
  }

  guardarDueno() {
    if (this.duenoForm.invalid) {
      this.duenoForm.markAllAsTouched();
      return;
    }
    this.cargandoLista = true;
    const data = this.duenoForm.value;
    if (this.editando) {
      this.duenoService.modificar({ ...this.duenoActual, ...data }).subscribe({
        next: (resp) => {
          if (resp.codigoRespuesta === 0 && resp.respuesta) {
            this.alertService.success('Dueño modificado correctamente');
            this.cerrarFormulario();
            this.cargarDuenos();
          } else {
            this.alertService.info(resp.glosaRespuesta || 'No se pudo modificar el dueño');
            this.cargandoLista = false;
          }
        },
        error: () => {
          this.alertService.error('Error al modificar el dueño');
          this.cargandoLista = false;
        },
      });
    } else {
      this.duenoService.crear(data).subscribe({
        next: (resp) => {
          if (resp.codigoRespuesta === 0 && resp.respuesta) {
            this.alertService.success('Dueño creado correctamente');
            this.cerrarFormulario();
            this.cargarDuenos();
          } else {
            this.alertService.info(resp.glosaRespuesta || 'No se pudo crear el dueño');
            this.cargandoLista = false;
          }
        },
        error: () => {
          this.alertService.error('Error al crear el dueño');
          this.cargandoLista = false;
        },
      });
    }
  }

  confirmarEliminar(dueno: any) {
    this.duenoAEliminar = dueno;
  }

  cancelarEliminar() {
    this.duenoAEliminar = null;
  }

  eliminarDueno() {
    if (this.duenoAEliminar && this.duenoAEliminar.id) {
      this.cargandoLista = true;
      this.duenoService.eliminar(this.duenoAEliminar.id).subscribe({
        next: (resp: any) => {
          if ((resp.codigoRespuesta === 0 || resp.codigoRespuesta === 200) && resp.respuesta) {
            this.alertService.success('Dueño eliminado correctamente');
            this.cancelarEliminar();
            this.cargarDuenos();
          } else {
            this.alertService.info(resp.glosaRespuesta || 'No se pudo eliminar el dueño');
            this.cargandoLista = false;
          }
        },
        error: () => {
          this.alertService.error('Error al eliminar el dueño');
          this.cargandoLista = false;
        },
      });
    }
  }
  volver(cambiarVista: number) {
    this.volverMenu.emit(cambiarVista);
  }
}

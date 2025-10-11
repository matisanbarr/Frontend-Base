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
import { Mascota } from '../../../../models/mascota.model';
import { PaginacionDto, RespuestaPaginada } from '../../../../../../models';
import { AlertService } from '../../../../../../core/services/alert.service';
import { AlertGlobalComponent } from '../../../../../../shared/components/alert-global/alert-global.component';
import { MascotaService } from '../../../../services/mascota.service';

@Component({
  selector: 'app-gestor-dueno',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AlertGlobalComponent],
  templateUrl: './gestor-dueno.component.html',
  styleUrls: ['./gestor-dueno.component.scss'],
})
export class GestorDuenoComponent implements OnInit {
  razas: { id: string; nombre: string }[] = [
    { id: '1', nombre: 'Labrador' },
    { id: '2', nombre: 'Pastor Alemán' },
    { id: '3', nombre: 'Siames' },
    { id: '4', nombre: 'Persa' },
    { id: '5', nombre: 'Otro' },
  ];
  mascotaForm!: FormGroup;
  cargandoMascotaForm: boolean = false;
  // Gestión de mascotas por dueño
  mostrarModalMascotas = false;
  duenoMascotas: Dueno | null = null;
  mascotasDueno: Mascota[] = [];
  cargandoMascotas = false;
  mostrarFormularioMascota = false;
  mascotaActual: Mascota | null = null;
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
  private readonly mascotaService = inject(MascotaService);
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

  abrirModalMascotas(dueno: Dueno) {
    this.duenoMascotas = dueno;
    this.mostrarModalMascotas = true;
    this.cargarMascotasDueno(dueno.id ?? '');
    this.mostrarFormularioMascota = false;
    this.mascotaActual = null;
  }

  cerrarModalMascotas() {
    this.mostrarModalMascotas = false;
    this.duenoMascotas = null;
    this.mascotasDueno = [];
    this.mascotaActual = null;
    this.mostrarFormularioMascota = false;
  }

  cargarMascotasDueno(duenoId: string) {
    this.cargandoMascotas = true;
    this.mascotaService.listarMascotasPorDueno(duenoId).subscribe({
      next: (resp) => {
        if (resp.codigoRespuesta === 0 && resp.respuesta) {
          this.mascotasDueno = resp.respuesta || [];
        } else {
          this.mascotasDueno = [];
        }
        this.cargandoMascotas = false;
      },
      error: () => {
        this.mascotasDueno = [];
        this.cargandoMascotas = false;
      },
    });
  }

  abrirFormularioMascota(mascota?: Mascota) {
    this.mascotaActual = mascota || null;
    this.mostrarFormularioMascota = true;
    this.mascotaForm = this.fb.group({
      nombre: [mascota?.nombre || '', [Validators.required, Validators.minLength(2)]],
      sexo: [mascota?.sexo || '', [Validators.required]],
      fechaNacimiento: [mascota?.fechaNacimiento || '', []],
      color: [mascota?.color || ''],
      observaciones: [mascota?.observaciones || ''],
      razaId: [mascota?.razaId || '', [Validators.required]],
      historialesMedicos: [mascota?.historialesMedicos || []],
      citas: [mascota?.citas || []],
    });
  }

  editarMascota(mascota: Mascota) {
    this.abrirFormularioMascota(mascota);
  }

  eliminarMascota(mascota: Mascota) {
    if (!this.duenoMascotas?.id || !mascota.id) return;
    this.cargandoMascotas = true;
    this.duenoService.eliminarMascotas(this.duenoMascotas.id ?? '', [mascota.id]).subscribe({
      next: (resp) => {
        if (resp.codigoRespuesta === 0 && resp.respuesta) {
          this.alertService.success('Mascota eliminada correctamente');
          if (this.duenoMascotas?.id) {
            this.cargarMascotasDueno(this.duenoMascotas.id);
          }
        } else {
          this.alertService.info(resp.glosaRespuesta || 'No se pudo eliminar la mascota');
        }
        this.cargandoMascotas = false;
      },
      error: () => {
        this.alertService.error('Error al eliminar la mascota');
        this.cargandoMascotas = false;
      },
    });
  }

  guardarMascota() {
    if (
      !this.mascotaForm ||
      this.mascotaForm.invalid ||
      !this.duenoMascotas ||
      !this.duenoMascotas.id
    ) {
      this.mascotaForm?.markAllAsTouched();
      return;
    }
    this.cargandoMascotaForm = true;
    const mascotaData = {
      ...this.mascotaActual,
      ...this.mascotaForm.value,
    };
    let mascotasActualizadas = [...(this.mascotasDueno ?? [])];
    if (this.mascotaActual) {
      mascotasActualizadas = mascotasActualizadas.map((m) =>
        m.id === this.mascotaActual?.id ? mascotaData : m
      );
    } else {
      mascotasActualizadas.push(mascotaData);
    }
    this.duenoService
      .agregarOModificarMascotas(this.duenoMascotas.id, mascotasActualizadas)
      .subscribe({
        next: (resp) => {
          if (resp.codigoRespuesta === 0 && resp.respuesta) {
            this.alertService.success(
              this.mascotaActual ? 'Mascota modificada' : 'Mascota agregada'
            );
            if (this.duenoMascotas && this.duenoMascotas.id) {
              this.cargarMascotasDueno(this.duenoMascotas.id);
            }
            this.mostrarFormularioMascota = false;
            this.mascotaActual = null;
          } else {
            this.alertService.info(resp.glosaRespuesta || 'No se pudo guardar la mascota');
          }
          this.cargandoMascotaForm = false;
        },
        error: () => {
          this.alertService.error('Error al guardar la mascota');
          this.cargandoMascotaForm = false;
        },
      });
  }
}

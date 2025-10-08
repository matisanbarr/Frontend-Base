import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ConfirmModalComponent } from '../../../shared/components';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { AlertService } from '../../../core/services/alert.service';
import { Usuario } from '../../../models/usuario.model';
import { Tenant } from '../../../models/tenant.model';
import { TenantService } from '../../../core/services/tenant.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RolService } from '../../../core/services/rol.service';
import { UsuarioRolService } from '../../../core/services/usuario-rol.service';
import { PaginacionDto } from '../../../models/compartidos';
import { AdminListComponent } from '../../../shared/components/admin-list/admin-list.component';
import { FormButtonsComponent } from '../../../shared/components/form-buttons/form-buttons.component';

import { AdminFormHeaderComponent } from '../../../shared/components/admin-form-header/admin-form-header.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmModalComponent,
    ToastAlertsComponent,
    AdminListComponent,
    FormButtonsComponent,
    AdminFormHeaderComponent,
  ],
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
})
export class AdminUsersPage {
  seleccionarRolUnico(indice: number) {
    this.rolesDisponibles.forEach((rol, i) => {
      rol.seleccionado = i === indice;
    });
  }
  // Funciones para mostrar en la lista
  usuarioNombreFn = (u: Usuario) => u.nombre ?? null;
  usuarioCorreoFn = (u: Usuario) => u.email ?? null;
  usuarioRolFn = (u: Usuario) => u.roles ?? null;
  usuarioEstadoActivoFn = (u: Usuario) =>
    typeof u.estadoActivo === 'boolean' ? u.estadoActivo : null;

  usuarioSeleccionado: Usuario | null = null;
  rolesDisponibles: Array<{
    id: string;
    nombre: string;
    descripcion: string;
    seleccionado: boolean;
  }> = [];
  usuarioForm: FormGroup;
  estadoActivoControl;
  usuarios: Usuario[] = [];
  tenants: Tenant[] = [];
  loading = false;
  showConfirmModal = false;
  modoEdicion = false;
  usuarioEditandoId: string | null = null;
  usuarioAEliminar: string | null = null;
  usuarioANombreEliminar: string | null = null;
  filtroBusqueda = '';
  paginaActual = 1;
  totalPaginas = 1;
  totalRegistros = 0;

  readonly rolService = inject(RolService);
  readonly usuarioRolService = inject(UsuarioRolService);
  readonly usuarioService = inject(UsuarioService);
  readonly tenantService = inject(TenantService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  readonly generos = [
    { value: 0, label: 'No especificado' },
    { value: 1, label: 'Masculino' },
    { value: 2, label: 'Femenino' },
    { value: 3, label: 'Otro' },
  ];

  constructor() {
    this.estadoActivoControl = this.fb.control(true);
    this.usuarioForm = this.fb.group({
      primerNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      segundoNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      primerApellido: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      ],
      segundoApellido: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      ],
      nombre: ['', [Validators.maxLength(200)]],
      password: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: [''],
      genero: [null, [Validators.required]],
      isGlobal: [false],
      tenantId: [null, [Validators.required]],
      estadoActivo: this.estadoActivoControl,
    });
    this.usuarioForm.get('isGlobal')?.valueChanges.subscribe((isGlobal: boolean) => {
      const tenantIdCtrl = this.usuarioForm.get('tenantId');
      if (isGlobal) {
        tenantIdCtrl?.setValue(null);
        tenantIdCtrl?.disable();
      } else {
        tenantIdCtrl?.enable();
      }
    });
    this.cargarUsuarios();
    this.cargarTenants();

    // Sincronizar el control de estadoActivo con el formulario
    this.estadoActivoControl.valueChanges.subscribe((valor) => {
      this.usuarioForm.get('estadoActivo')?.setValue(valor, { emitEvent: false });
    });
  }

  cargarTenants(): void {
    this.tenantService.listarTenants().subscribe({
      next: (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.tenants = resp.respuesta || [];
        } else if (resp?.codigoRespuesta === 1) {
          this.tenants = [];
          this.alertService.info?.(resp?.glosaRespuesta || 'No se encontraron empresas.');
        } else {
          this.tenants = [];
          this.alertService.error(resp?.glosaRespuesta || 'Error al cargar empresas.');
        }
      },
      error: () => this.alertService.error('Error al cargar empresas.'),
    });
  }

  cargarUsuarios(): Promise<void> {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    return new Promise((resolve, reject) => {
      this.usuarioService.listarPaginadoUsuarios(filtro).subscribe({
        next: (resp) => {
          if (resp?.codigoRespuesta === 0 && resp.respuesta) {
            const respuesta = resp.respuesta as { datos?: Usuario[]; total?: number };
            this.usuarios = Array.isArray(respuesta.datos) ? respuesta.datos : [];
            this.totalRegistros = typeof respuesta.total === 'number' ? respuesta.total : 0;
            this.totalPaginas = Math.ceil(this.totalRegistros / filtro.tamano);
          } else if (resp?.codigoRespuesta === 1) {
            this.usuarios = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.info?.(resp?.glosaRespuesta || 'No se encontraron usuarios.');
          } else {
            this.usuarios = [];
            this.totalRegistros = 0;
            this.totalPaginas = 1;
            this.alertService.error(resp?.glosaRespuesta || 'Error al cargar usuarios');
          }
          resolve();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.usuarios = [];
          this.totalRegistros = 0;
          this.totalPaginas = 1;
          this.alertService.error('Error al cargar usuarios');
          reject();
        },
      });
    });
  }

  buscarUsuarios(): void {
    this.paginaActual = 1;
    this.cargarUsuarios();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.cargarUsuarios();
  }

  async registrarUsuario() {
    this.loading = true;
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.alertService.error('Por favor, complete todos los campos obligatorios correctamente.');
      this.loading = false;
      return;
    }
    const usuario: Usuario = {
      ...this.usuarioForm.value,
      estadoActivo: this.estadoActivoControl.value,
      isGlobal: !!this.usuarioForm.get('isGlobal')?.value,
    };
    this.usuarioService.registro(usuario).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          this.alertService.success(resp?.glosaRespuesta || 'Usuario registrado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo registrar el usuario.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al registrar usuario');
        }
        await this.cargarUsuarios();
      },
      error: () => this.alertService.error('Error al registrar usuario'),
      complete: () => (this.loading = false),
    });
  }

  editarUsuario(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioEditandoId = usuario.id || null;
    this.usuarioForm.patchValue({
      primerNombre: usuario.primerNombre || '',
      segundoNombre: usuario.segundoNombre || '',
      primerApellido: usuario.primerApellido || '',
      segundoApellido: usuario.segundoApellido || '',
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      password: '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      genero: usuario.genero ?? 0,
      isGlobal: usuario.isGlobal ?? false,
      tenantId: usuario.isGlobal ? null : (usuario.tenantId ?? null),
      estadoActivo: usuario.estadoActivo ?? true,
    });
    // Refuerza la sincronización del switch
    this.estadoActivoControl.setValue(usuario.estadoActivo ?? true, { emitEvent: false });
    this.usuarioForm.get('tenantId')?.[usuario.isGlobal ? 'disable' : 'enable']();
    this.usuarioForm.markAsPristine();
  }

  get hayCambios(): boolean {
    return this.modoEdicion && this.usuarioForm.dirty;
  }

  async actualizarUsuario() {
    this.loading = true;
    if (!this.usuarioEditandoId) {
      this.loading = false;
      return;
    }
    if (this.usuarioForm.get('nombre')?.invalid) {
      this.alertService.error('El nombre es requerido y debe tener entre 3 y 50 caracteres.');
      this.usuarioForm.get('nombre')?.markAsTouched();
      this.loading = false;
      return;
    }
    if (this.usuarioForm.get('email')?.invalid) {
      this.alertService.error('El email es requerido y debe ser válido.');
      this.usuarioForm.get('email')?.markAsTouched();
      this.loading = false;
      return;
    }
    const usuario: Usuario = {
      ...this.usuarioForm.value,
      id: this.usuarioEditandoId,
      estadoActivo: this.estadoActivoControl.value,
    };
    this.usuarioService.modificar(usuario).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.limpiarFormulario();
          this.alertService.success(resp?.glosaRespuesta || 'Usuario actualizado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo actualizar el usuario.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al actualizar usuario');
        }
        await this.cargarUsuarios();
      },
      error: () => this.alertService.error('Error al actualizar usuario'),
      complete: () => (this.loading = false),
    });
  }

  limpiarFormulario(): void {
    this.usuarioForm.reset({
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      nombre: '',
      password: '',
      email: '',
      fechaNacimiento: '',
      genero: null,
      isGlobal: false,
      tenantId: null,
      estadoActivo: true,
    });
    // Forzar el valor booleano explícitamente después del reset
    this.usuarioForm.get('isGlobal')?.setValue(false, { emitEvent: false });
    this.usuarioForm.get('tenantId')?.enable();
    this.usuarioForm.get('genero')?.setValue(null);
    this.usuarioForm.get('tenantId')?.setValue(null);
    this.estadoActivoControl.setValue(true, { emitEvent: false });
    this.modoEdicion = false;
    this.usuarioEditandoId = null;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  eliminarUsuario(usuario: Usuario): void {
    this.usuarioAEliminar = usuario.id || null;
    this.usuarioANombreEliminar = usuario.nombre ?? null;
    this.showConfirmModal = true;
  }

  async confirmarEliminacion() {
    if (!this.usuarioAEliminar) return;
    this.loading = true;
    this.usuarioService.eliminarUsuario(this.usuarioAEliminar).subscribe({
      next: async (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.cerrarModal();
          this.alertService.success(resp?.glosaRespuesta || 'Usuario eliminado correctamente');
        } else if (resp?.codigoRespuesta === 1) {
          this.alertService.info?.(resp?.glosaRespuesta || 'No se pudo eliminar el usuario.');
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al eliminar usuario');
        }
        await this.cargarUsuarios();
      },
      error: () => this.alertService.error('Error al eliminar usuario'),
      complete: () => (this.loading = false),
    });
  }

  cerrarModal(): void {
    this.showConfirmModal = false;
    this.usuarioAEliminar = null;
    this.usuarioANombreEliminar = null;
  }

  generarNombreUsuario(): void {
    const nombreControl = this.usuarioForm.get('nombre');
    const { primerNombre, primerApellido, segundoApellido } = this.usuarioForm.value;
    const quitarAcentos = (str: string) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    let sugerido = '';
    if (primerNombre && primerApellido) {
      sugerido =
        quitarAcentos(primerNombre[0]?.toLowerCase() || '') +
        quitarAcentos((primerApellido as string).toLowerCase());
      if (segundoApellido)
        sugerido += quitarAcentos((segundoApellido as string)[0]?.toLowerCase() || '');
    } else if (primerNombre) {
      sugerido = quitarAcentos((primerNombre as string).toLowerCase());
    } else if (primerApellido) {
      sugerido = quitarAcentos((primerApellido as string).toLowerCase());
    }
    nombreControl?.setValue(sugerido);
    nombreControl?.markAsDirty();
  }

  getTenantName(tenantId: string | null | undefined): string {
    if (!tenantId) return 'Sin empresa';
    const tenant = this.tenants.find((t) => t.id === tenantId);
    return tenant ? tenant.nombre : 'Empresa desconocida';
  }

  abrirModalRoles(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    // Cargar roles disponibles
    this.rolService.listarRoles().subscribe({
      next: (resp) => {
        if (resp?.codigoRespuesta === 0 && Array.isArray(resp.respuesta)) {
          const rolesUsuario = (usuario.roles || []).map((r: any) => r.id);
          this.rolesDisponibles = resp.respuesta.map((rol: any) => ({
            id: rol.id,
            nombre: rol.nombre,
            descripcion: rol.descripcion || '',
            seleccionado: rolesUsuario.includes(rol.id),
          }));
        } else {
          this.rolesDisponibles = [];
        }
        const modal = document.getElementById('modalRoles');
        if (modal) {
          // @ts-ignore
          const bsModal = new window.bootstrap.Modal(modal);
          bsModal.show();
        }
      },
      error: () => {
        this.rolesDisponibles = [];
        this.alertService.error('Error al cargar roles');
      },
    });
  }

  guardarRolesUsuario() {
    if (!this.usuarioSeleccionado || !this.usuarioSeleccionado.id) {
      this.alertService.error('No se encontró el usuario.');
      return;
    }
    const rolesSeleccionados = this.rolesDisponibles.filter((r) => r.seleccionado).map((r) => r.id);
    const dto = { usuarioId: this.usuarioSeleccionado.id, roles: rolesSeleccionados };
    this.usuarioRolService.actualizarRolesUsuario(dto).subscribe({
      next: (resp) => {
        if (resp?.codigoRespuesta === 0) {
          this.alertService.success('Roles actualizados correctamente');
          this.cargarUsuarios();
        } else {
          this.alertService.error(resp?.glosaRespuesta || 'Error al actualizar roles');
        }
        const modal = document.getElementById('modalRoles');
        if (modal) {
          // @ts-ignore
          const bsModal = window.bootstrap.Modal.getInstance(modal);
          bsModal?.hide();
        }
      },
      error: () => {
        this.alertService.error('Error al actualizar roles');
      },
    });
  }
}

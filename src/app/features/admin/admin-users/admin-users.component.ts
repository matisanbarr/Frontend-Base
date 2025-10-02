import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ConfirmModalComponent } from '../../../shared/components';
import { RoleColorPipe } from '../pipes/role-color.pipe';
import { RouterModule } from '@angular/router';
import { ToastAlertsComponent } from '../../../shared/components/toast-alerts.component';
import { AlertService } from '../../../core/services/alert.service';
import { Usuario } from '../../../models/usuario.model';
import { Rol } from '../../../models/rol.model';
import { Tenant } from '../../../models/tenant.model';
import { TenantService } from '../../../core/services/tenant.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RolService } from '../../../core/services/rol.service';
import { PaginacionDto } from '../../../models/compartidos';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmModalComponent, RouterModule, ToastAlertsComponent, RoleColorPipe],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {  
  modoEdicion: boolean = false;
  usuarioEditandoId: string | null = null;
  usuarioForm: FormGroup;
  usuarios: Usuario[] = [];
  loading = false;
  showConfirmModal = false;
  usuarioAEliminar: string | null = null;
  usuarioANombreEliminar: string | null = null;
  filtroBusqueda: string = '';
  paginaActual: number = 1;
  totalPaginas: number = 1;
  totalRegistros: number = 0;
  rolesDisponibles: Rol[] = [];
  rolesSeleccionadosOriginal: string[] = [];
  rolesSeleccionadosTemp: string[] = [];
  rolesCambiados: boolean = false;
  tenants: Tenant[] = [];

  readonly usuarioService = inject(UsuarioService);
  readonly rolService = inject(RolService);
  readonly tenantService = inject(TenantService);
  readonly fb = inject(FormBuilder);
  readonly alertService = inject(AlertService);

  generos = [
    { value: 0, label: 'No especificado' },
    { value: 1, label: 'Masculino' },
    { value: 2, label: 'Femenino' },
    { value: 3, label: 'Otro' }
  ];

  constructor() {
    this.usuarioForm = this.fb.group({
      primerNombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      segundoNombre: ['', [Validators.maxLength(30)]],
      primerApellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      segundoApellido: ['', [Validators.maxLength(30)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      fechaNacimiento: [''],
      genero: [0],
      isGlobal: [false],
      tenantId: [null, Validators.required],
      roles: [[]],
      estadoActivo: [true]
    });
    this.usuarioForm.get('isGlobal')?.valueChanges.subscribe((isGlobal: boolean) => {
      if (isGlobal) {
        this.usuarioForm.get('tenantId')?.setValue(null);
        this.usuarioForm.get('tenantId')?.disable();
      } else {
        this.usuarioForm.get('tenantId')?.enable();
      }
    });
    this.cargarUsuarios();
    this.cargarRoles();
    this.cargarTenants();
    // Sugerir nombre de usuario automáticamente (solo si el usuario no lo ha modificado manualmente)
    this.usuarioForm.get('primerNombre')?.valueChanges.subscribe(() => this.sugerirNombreUsuario());
    this.usuarioForm.get('segundoNombre')?.valueChanges.subscribe(() => this.sugerirNombreUsuario());
    this.usuarioForm.get('primerApellido')?.valueChanges.subscribe(() => this.sugerirNombreUsuario());
    this.usuarioForm.get('segundoApellido')?.valueChanges.subscribe(() => this.sugerirNombreUsuario());
  }


  private sugerirNombreUsuario(): void {
    const nombreControl = this.usuarioForm.get('nombre');
    // Solo sugerir si el usuario no ha escrito manualmente o si el campo está vacío
    if (nombreControl?.dirty && nombreControl.value) return;
    const primerNombre = (this.usuarioForm.get('primerNombre')?.value || '').toLowerCase().replace(/[^a-záéíóúüñ]/gi, '');
    const primerApellido = (this.usuarioForm.get('primerApellido')?.value || '').toLowerCase().replace(/[^a-záéíóúüñ]/gi, '');
    const segundoApellido = (this.usuarioForm.get('segundoApellido')?.value || '').toLowerCase().replace(/[^a-záéíóúüñ]/gi, '');
    let sugerido = '';
    if (primerNombre && primerApellido) {
      sugerido = primerNombre.charAt(0) + primerApellido;
      if (segundoApellido) {
        sugerido += segundoApellido.charAt(0);
      }
    } else if (primerNombre) {
      sugerido = primerNombre;
    } else if (primerApellido) {
      sugerido = primerApellido;
    }
    nombreControl?.setValue(sugerido, { emitEvent: false });
    nombreControl?.markAsPristine();
  }

  cargarTenants(): void {
    this.tenantService.listarTenants().subscribe({
      next: (tenants: Tenant[]) => {
        this.tenants = tenants;
      },
      error: () => {
        this.tenants = [];
      }
    });
  }

  cargarRoles(): void {
    this.rolService.listarRoles().subscribe({
      next: (roles: Rol[]) => {
        this.rolesDisponibles = roles;
      },
      error: () => {
        this.rolesDisponibles = [];
      }
    });
  }

  cargarUsuarios(): void {
    this.loading = true;
    const filtro = new PaginacionDto();
    filtro.filtro = this.filtroBusqueda;
    filtro.pagina = this.paginaActual;
    filtro.tamano = 10;
    this.usuarioService.listarPaginadoUsuarios(filtro).subscribe({
      next: (respuesta: { datos: Usuario[], total: number }) => {
        this.usuarios = respuesta.datos;
        this.totalRegistros = respuesta.total;
        this.totalPaginas = Math.ceil(respuesta.total / filtro.tamano);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error al cargar usuarios');
      }
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

  registrarUsuario(): void {
    // Validar contraseña solo al crear
    if (
      this.usuarioForm.invalid ||
      !this.usuarioForm.value.password ||
      this.usuarioForm.value.password.length < 6
    ) {
      this.usuarioForm.get('password')?.setErrors({ required: true });
      return;
    }
    const usuario: Usuario = {
      ...this.usuarioForm.value,
      roles: [] // No se asignan roles al crear
    };
    this.loading = true;
    this.usuarioService.registro(usuario).subscribe({
      next: () => {
        this.alertService.success('Usuario registrado correctamente');
        this.usuarioForm.reset();
        this.cargarUsuarios();
        this.loading = false;
      },
      error: () => {
        this.alertService.error('Error al registrar usuario');
        this.loading = false;
      }
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
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      genero: usuario.genero ?? 0,
      isGlobal: usuario.isGlobal ?? false,
      tenantId: usuario.isGlobal ? null : (usuario.tenantId ?? null),
      roles: usuario.roles.map(r => r.id),
      estadoActivo: usuario.estadoActivo ?? true
    });
    if (usuario.isGlobal) {
      this.usuarioForm.get('tenantId')?.disable();
    } else {
      this.usuarioForm.get('tenantId')?.enable();
    }
    this.usuarioForm.markAsPristine();
    this.rolesSeleccionadosOriginal = usuario.roles.map(r => r.id ?? '').filter(id => !!id);
    this.rolesSeleccionadosTemp = [...this.rolesSeleccionadosOriginal];
    this.rolesCambiados = false;
  }

  onRolTempCheck(event: any, rolId: string): void {
    if (event.target.checked) {
      if (!this.rolesSeleccionadosTemp.includes(rolId)) {
        this.rolesSeleccionadosTemp.push(rolId);
      }
    } else {
      this.rolesSeleccionadosTemp = this.rolesSeleccionadosTemp.filter(id => id !== rolId);
    }
    this.rolesCambiados = this.detectarCambiosRoles();
    if (this.modoEdicion) {
      this.usuarioForm.markAsDirty(); // Marca el formulario como dirty al cambiar roles
    }
  }

  detectarCambiosRoles(): boolean {
    const original = [...this.rolesSeleccionadosOriginal].sort();
    const actual = [...this.rolesSeleccionadosTemp].sort();
    return JSON.stringify(original) !== JSON.stringify(actual);
  }

  guardarRoles(): void {
    if (!this.usuarioEditandoId) return;
    const rolesAAsignar = this.rolesSeleccionadosTemp.filter(id => !this.rolesSeleccionadosOriginal.includes(id));
    const rolesAQuitar = this.rolesSeleccionadosOriginal.filter(id => !this.rolesSeleccionadosTemp.includes(id));
    const usuarioId = this.usuarioEditandoId;
    let peticiones = [];
    if (rolesAAsignar.length > 0) {
      peticiones.push(this.usuarioService.asignarRoles({ usuarioId, rolesId: rolesAAsignar }));
    }
    if (rolesAQuitar.length > 0) {
      peticiones.push(this.usuarioService.aquitarRoles({ usuarioId, rolesId: rolesAQuitar }));
    }
    if (peticiones.length === 0) return;
    this.loading = true;
    Promise.all(peticiones.map(p => p.toPromise())).then(() => {
      this.alertService.success('Roles actualizados correctamente');
      this.cargarUsuarios();
      this.rolesSeleccionadosOriginal = [...this.rolesSeleccionadosTemp];
      this.rolesCambiados = false;
      this.loading = false;
    }).catch(() => {
      this.alertService.error('Error al actualizar roles');
      this.loading = false;
    });
  }

  // Detecta cambios en el formulario o roles para mostrar el botón de modificar
  get hayCambios(): boolean {
    if (!this.modoEdicion) return false;
    // Detecta si el formulario fue modificado
    const formCambiado = this.usuarioForm.dirty;
    // Detecta si los roles fueron modificados
    const rolesCambiados = this.detectarCambiosRoles();
    return formCambiado || rolesCambiados;
  }

  actualizarUsuarioYRoles(): void {
    if (!this.usuarioEditandoId) return;
    // Validaciones manuales
    if (this.usuarioForm.get('nombre')?.invalid) {
      this.alertService.error('El nombre es requerido y debe tener entre 3 y 50 caracteres.');
      this.usuarioForm.get('nombre')?.markAsTouched();
      return;
    }
    if (this.usuarioForm.get('email')?.invalid) {
      this.alertService.error('El email es requerido y debe ser válido.');
      this.usuarioForm.get('email')?.markAsTouched();
      return;
    }
    // Al menos un rol seleccionado en edición
    if (this.modoEdicion && this.rolesSeleccionadosTemp.length === 0) {
      this.alertService.error('Debes asignar al menos un rol al usuario.');
      return;
    }
    // El password solo es requerido al crear, no al modificar
    if (!this.modoEdicion && (!this.usuarioForm.get('password')?.value || this.usuarioForm.get('password')?.invalid)) {
      this.alertService.error('La contraseña es requerida y debe tener al menos 6 caracteres.');
      this.usuarioForm.get('password')?.markAsTouched();
      return;
    }
    const usuario: Usuario = {
      ...this.usuarioForm.value,
      id: this.usuarioEditandoId,
      roles: this.rolesDisponibles.filter(r => r.id && this.rolesSeleccionadosTemp.includes(r.id!))
    };
    this.loading = true;
    this.usuarioService.modificar(usuario).subscribe({
      next: () => {
        // Actualizar roles si hay cambios
        const rolesAAsignar = this.rolesSeleccionadosTemp.filter(id => !this.rolesSeleccionadosOriginal.includes(id));
        const rolesAQuitar = this.rolesSeleccionadosOriginal.filter(id => !this.rolesSeleccionadosTemp.includes(id));
        let peticiones = [];
        if (rolesAAsignar.length > 0) {
          peticiones.push(this.usuarioService.asignarRoles({ usuarioId: usuario.id!, rolesId: rolesAAsignar }));
        }
        if (rolesAQuitar.length > 0) {
          peticiones.push(this.usuarioService.aquitarRoles({ usuarioId: usuario.id!, rolesId: rolesAQuitar }));
        }
        if (peticiones.length > 0) {
          Promise.all(peticiones.map(p => p.toPromise())).then(() => {
            this.alertService.success('Usuario y roles actualizados correctamente');
            this.cargarUsuarios();
            this.rolesSeleccionadosOriginal = [...this.rolesSeleccionadosTemp];
            this.rolesCambiados = false;
            this.loading = false;
            this.limpiarFormulario();
          }).catch(() => {
            this.alertService.error('Error al actualizar roles');
            this.loading = false;
          });
        } else {
          this.alertService.success('Usuario actualizado correctamente');
          this.cargarUsuarios();
          this.loading = false;
          this.limpiarFormulario();
        }
      },
      error: () => {
        this.alertService.error('Error al actualizar usuario');
        this.loading = false;
      }
    });
  }

  limpiarFormulario(): void {
    this.usuarioForm.reset({
      nombre: '',
      email: '',
      password: '',
      fechaNacimiento: '',
      genero: 0,
      isGlobal: false,
      tenantId: null,
      roles: [],
      estadoActivo: true
    });
    this.usuarioForm.get('tenantId')?.enable();
    this.modoEdicion = false;
    this.usuarioEditandoId = null;
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.usuarioEditandoId = null;
    this.usuarioForm.reset();
  }

  eliminarUsuario(usuario: Usuario): void {
    this.usuarioAEliminar = usuario.id || null;
    this.usuarioANombreEliminar = usuario.nombre;
    this.showConfirmModal = true;
  }

  confirmarEliminacion(): void {
    if (!this.usuarioAEliminar) return;
    this.loading = true;
    this.usuarioService.eliminarUsuario(this.usuarioAEliminar).subscribe({
      next: () => {
        this.alertService.success('Usuario eliminado correctamente');
        this.cargarUsuarios();
        this.loading = false;
        this.cerrarModal();
      },
      error: () => {
        this.alertService.error('Error al eliminar usuario');
        this.loading = false;
        this.cerrarModal();
      }
    });
  }

  cerrarModal(): void {
    this.showConfirmModal = false;
    this.usuarioAEliminar = null;
    this.usuarioANombreEliminar = null;
  }

  generarNombreUsuario(): void {
    this.sugerirNombreUsuario();
    const nombreControl = this.usuarioForm.get('nombre');
    nombreControl?.markAsDirty(); // Marca como modificado para que el formulario detecte el cambio
  }
  getTenantName(tenantId: string | null | undefined): string {
    if (!tenantId) return 'Sin empresa';
    const tenant = this.tenants.find((t: Tenant) => t.id === tenantId);
    return tenant ? tenant.nombre : 'Empresa desconocida';
  }
  get estadoActivoControl(): FormControl {
    return this.usuarioForm.get('estadoActivo') as FormControl;
  }
}

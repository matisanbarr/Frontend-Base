import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Servicios
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { HttpConfigService } from './services/http-config.service';
import { LoadingService } from './services/loading.service';
import { PlanService } from './services/plan.service';
import { RegisterService } from './services/register.service';
import { RolService } from './services/rol.service';
import { TenantPlanService } from './services/tenant-plan.service';
import { TenantService } from './services/tenant.service';
import { UsuarioService } from './services/usuario.service';
// Guards
import { LoginGuard } from './guards/login.guard';
import { RoleGuard } from './guards/role.guard';
import { TokenGuard } from './guards/token.guard';
// Interceptores
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

export const CORE_PROVIDERS = [
  AuthService,
  AlertService,
  HttpConfigService,
  LoadingService,
  PlanService,
  RegisterService,
  RolService,
  TenantPlanService,
  TenantService,
  UsuarioService,
  LoginGuard,
  RoleGuard,
  TokenGuard,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
];

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Importa aquí los servicios, guards e interceptores
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { HttpConfigService } from './services/http-config.service';
import { LoadingService } from './services/loading.service';
import { PlanService } from './services/plan.service';
import { TenantService } from './services/tenant.service';
import { UsuarioService } from './services/usuario.service';

import { LoginGuard } from './guards/login.guard';
import { TokenGuard } from './guards/token.guard';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

@NgModule({
  providers: [
    AuthService,
    AlertService,
    HttpConfigService,
    LoadingService,
    PlanService,
    TenantService,
    UsuarioService,
    LoginGuard,
    TokenGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}

import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
        timeOut: 1000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
        progressBar: true,
        progressAnimation:	'decreasing',
        newestOnTop: true,
        tapToDismiss: true,
      }),
      importProvidersFrom(
        MatSelectModule,
        NgxMatSelectSearchModule
      )
  ]
};

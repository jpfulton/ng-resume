import { ApplicationConfig } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { COOKIE_CONSENT_CONFIG } from './core/constants/cookieconsent-constants';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppHttpInterceptor } from './core/interceptors/app-http.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';
import { ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import routeConfig from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            BrowserModule,
            RouterModule,
            NgcCookieConsentModule.forRoot(COOKIE_CONSENT_CONFIG),
            MatDialogModule
        ),
        provideRouter(routeConfig),
        { provide: ErrorHandler, useClass: ApplicationinsightsAngularpluginErrorService },
        { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
        ]
};

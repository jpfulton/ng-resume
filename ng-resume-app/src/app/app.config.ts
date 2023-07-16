/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-returns */
import { ApplicationConfig, ModuleWithProviders } from "@angular/core";

import { MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { COOKIE_CONSENT_CONFIG } from "./core/constants/cookieconsent-constants";
import { NgcCookieConsentModule } from "ngx-cookieconsent";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  BrowserModule,
  provideClientHydration,
} from "@angular/platform-browser";
import { AppHttpInterceptor } from "./core/interceptors/app-http.interceptor";
import {
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
  provideHttpClient,
} from "@angular/common/http";
import { ApplicationinsightsAngularpluginErrorService } from "@microsoft/applicationinsights-angularplugin-js";
import { ErrorHandler, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import routeConfig from "./app.routes";
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalModule,
  MsalService,
} from "@azure/msal-angular";
import {
  IPublicClientApplication,
  InteractionType,
  PublicClientApplication,
} from "@azure/msal-browser";
import { loginRequest, msalConfig } from "./core/constants/auth-constants";
import { CommonModule } from "@angular/common";

function getClientApp(): IPublicClientApplication {
  const clientApp = new PublicClientApplication(msalConfig);
  return clientApp;
}

function getMsalModuleProviders(): ModuleWithProviders<MsalModule> {
  return MsalModule.forRoot(
    getClientApp(),
    {
      interactionType: InteractionType.Redirect,
      authRequest: {},
    },
    {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map(),
    },
  );
}

/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  const client = new PublicClientApplication(msalConfig);
  return client;
}

/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest,
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      CommonModule,
      BrowserModule,
      getMsalModuleProviders(),
      NgcCookieConsentModule.forRoot(COOKIE_CONSENT_CONFIG),
      MatRippleModule,
      MatDialogModule,
    ),

    provideClientHydration(),
    provideRouter(routeConfig),
    {
      provide: ErrorHandler,
      useClass: ApplicationinsightsAngularpluginErrorService,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),

    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};

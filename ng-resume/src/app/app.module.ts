import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResumeComponent } from "./resume/resume.component";

import { provideRouter } from '@angular/router';
import routeConfig from './routes';

import { COOKIE_CONSENT_CONFIG } from './core/constants/cookieconsent-constants';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';

import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';

import { ErrorComponent } from './core/components/error/error.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { CookiePolicyComponent } from './core/components/cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './core/components/privacy-policy/privacy-policy.component';
import { SpinnerComponent } from './core/components/spinner/spinner.component';

import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';

/**
 * Primary NgModule for app.
 * 
 * References:
 *  https://github.com/microsoft/applicationinsights-angularplugin-js/blob/main/projects/applicationinsights-angularplugin-js/src/lib/applicationinsights-angularplugin-error.service.ts
 */
@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent,
        NotFoundComponent,
        CookiePolicyComponent,
        PrivacyPolicyComponent,
        SpinnerComponent,
    ],
    providers: [
        provideRouter(routeConfig),
        { provide: ErrorHandler, useClass: ApplicationinsightsAngularpluginErrorService },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        BrowserAnimationsModule,
        NgcCookieConsentModule.forRoot(COOKIE_CONSENT_CONFIG),
        HeaderComponent,
        FooterComponent,
        ResumeComponent
    ]
})
export class AppModule { }

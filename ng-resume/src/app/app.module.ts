import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResumeComponent } from "./resume/resume.component";
import { GlobalErrorHandler } from './core/utils/global-error-handler';

import { provideRouter } from '@angular/router';
import routeConfig from './routes';

import { COOKIE_CONSENT_CONFIG } from './core/constants/cookieconsent-constants';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';

import { ErrorComponent } from './core/components/error/error.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { CookiePolicyComponent } from './core/components/cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './core/components/privacy-policy/privacy-policy.component';

@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent,
        NotFoundComponent,
        CookiePolicyComponent,
        PrivacyPolicyComponent,
    ],
    providers: [
        provideRouter(routeConfig),
        { provide: ErrorHandler, useClass: GlobalErrorHandler},
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        BrowserAnimationsModule,
        NgcCookieConsentModule.forRoot(COOKIE_CONSENT_CONFIG),
        ResumeComponent
    ]
})
export class AppModule { }

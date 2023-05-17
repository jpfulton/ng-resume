import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResumeComponent } from "./resume/resume.component";
import { GlobalErrorHandler } from './core/utils/global-error-handler';

@NgModule({
    declarations: [
        AppComponent,
    ],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler},
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ResumeComponent
    ]
})
export class AppModule { }

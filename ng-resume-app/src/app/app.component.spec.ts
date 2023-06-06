import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgcCookieConsentModule } from 'ngx-cookieconsent';

import { AppComponent } from './app.component';
import { COOKIE_CONSENT_CONFIG } from './core/constants/cookieconsent-constants';
import { SpinnerComponent } from './core/components/spinner/spinner.component';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        NgcCookieConsentModule.forRoot(COOKIE_CONSENT_CONFIG),
        MatDialogModule,
        HeaderComponent,
        FooterComponent,
        SpinnerComponent,
        AppComponent
    ]
}));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
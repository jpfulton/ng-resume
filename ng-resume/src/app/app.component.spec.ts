import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgcCookieConsentModule } from 'ngx-cookieconsent';

import { AppComponent } from './app.component';
import { COOKIE_CONSENT_CONFIG } from './core/constants/cookieconsent-constants';
import { SpinnerComponent } from './core/components/spinner/spinner.component';
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [
      AppComponent,
      SpinnerComponent
    ],
    imports: [
      RouterTestingModule,
      NgcCookieConsentModule.forRoot(COOKIE_CONSENT_CONFIG),
      HeaderComponent,
      FooterComponent
    ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
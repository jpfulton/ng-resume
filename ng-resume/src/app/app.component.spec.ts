import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgcCookieConsentModule } from 'ngx-cookieconsent';

import { AppComponent } from './app.component';
import { COOKIE_CONSENT_CONFIG } from './core/constants/cookieconsent-constants';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent],
    imports: [
      RouterTestingModule,
      NgcCookieConsentModule.forRoot(COOKIE_CONSENT_CONFIG)
    ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
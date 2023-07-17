import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { NgcCookieConsentModule } from "ngx-cookieconsent";

import { AppComponent } from "./app.component";
import { COOKIE_CONSENT_CONFIG } from "./core/constants/cookieconsent-constants";
import { SpinnerComponent } from "./core/components/spinner/spinner.component";
import { HeaderComponent } from "./core/components/header/header.component";
import { FooterComponent } from "./core/components/footer/footer.component";
import { MatDialogModule } from "@angular/material/dialog";
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalModule,
  MsalService,
} from "@azure/msal-angular";
import { MSALInstanceFactory, MSALGuardConfigFactory } from "./app.config";

describe("AppComponent", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgcCookieConsentModule.forRoot(COOKIE_CONSENT_CONFIG),
        MatDialogModule,
        HeaderComponent,
        FooterComponent,
        SpinnerComponent,
        AppComponent,
        MsalModule,
      ],
      providers: [
        MsalService,
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      ],
    }),
  );

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

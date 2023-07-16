import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ClaimsViewComponent } from "./claims-view.component";
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalModule,
  MsalService,
} from "@azure/msal-angular";
import {
  MSALInstanceFactory,
  MSALGuardConfigFactory,
} from "src/app/app.config";

describe("ClaimsViewComponent", () => {
  let component: ClaimsViewComponent;
  let fixture: ComponentFixture<ClaimsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClaimsViewComponent, MsalModule],
      providers: [
        MsalService,
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      ],
    });
    fixture = TestBed.createComponent(ClaimsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from "@angular/core/testing";

import { TestService } from "./test.service";
import {
  MsalModule,
  MsalService,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
} from "@azure/msal-angular";
import {
  MSALInstanceFactory,
  MSALGuardConfigFactory,
} from "src/app/app.config";
import { MatDialogModule } from "@angular/material/dialog";

describe("TestService", () => {
  let service: TestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MsalModule, MatDialogModule],
      providers: [
        MsalService,
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      ],
    });
    service = TestBed.inject(TestService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

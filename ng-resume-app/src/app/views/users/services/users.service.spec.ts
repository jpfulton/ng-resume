import { TestBed } from "@angular/core/testing";

import { UsersService } from "./users.service";
import { MatDialogModule } from "@angular/material/dialog";
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalModule,
  MsalService,
} from "@azure/msal-angular";
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
} from "src/app/app.config";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MsalModule, MatDialogModule],
      providers: [
        MsalService,
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      ],
    });
    service = TestBed.inject(UsersService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

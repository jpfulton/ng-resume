import { TestBed } from '@angular/core/testing';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';

import { AuthService } from './auth.service';
import { MSALGuardConfigFactory, MSALInstanceFactory } from 'src/app/app.config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MsalModule
      ],
      providers: [
        MsalService,
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

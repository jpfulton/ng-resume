import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';
import routeConfig from 'src/app/app.routes';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
import { MSALInstanceFactory, MSALGuardConfigFactory } from 'src/app/app.config';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        HeaderComponent,
        MsalModule
      ],
      providers: [
        provideRouter(routeConfig),
        MsalService,
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      ]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

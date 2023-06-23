import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersViewComponent } from './users-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
import { MSALInstanceFactory, MSALGuardConfigFactory } from 'src/app/app.config';

describe('UsersViewComponent', () => {
  let component: UsersViewComponent;
  let fixture: ComponentFixture<UsersViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        UsersViewComponent,
        MsalModule,
        MatDialogModule
      ],
      providers: [
        MsalService,
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      ]
    });
    fixture = TestBed.createComponent(UsersViewComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

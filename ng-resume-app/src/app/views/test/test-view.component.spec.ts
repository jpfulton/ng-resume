import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestViewComponent } from './test-view.component';
import { MsalModule, MsalService, MSAL_INSTANCE, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { MSALInstanceFactory, MSALGuardConfigFactory } from 'src/app/app.config';
import { MatDialogModule } from '@angular/material/dialog';

describe('TestViewComponent', () => {
  let component: TestViewComponent;
  let fixture: ComponentFixture<TestViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestViewComponent,
        MsalModule,
        MatDialogModule
      ],
      providers: [
        MsalService,
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      ]
    });
    fixture = TestBed.createComponent(TestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

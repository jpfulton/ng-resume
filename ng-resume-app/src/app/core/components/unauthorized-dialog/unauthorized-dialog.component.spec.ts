import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedDialogComponent } from './unauthorized-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

describe('UnauthorizedDialogComponent', () => {
  let component: UnauthorizedDialogComponent;
  let fixture: ComponentFixture<UnauthorizedDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        UnauthorizedDialogComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(UnauthorizedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

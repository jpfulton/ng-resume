import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ErrorDialogComponent } from "./error-dialog.component";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

describe("ErrorDialogComponent", () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, ErrorDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    });
    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

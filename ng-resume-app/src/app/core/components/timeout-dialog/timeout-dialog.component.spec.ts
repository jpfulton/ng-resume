import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeoutDialogComponent } from "./timeout-dialog.component";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

describe("TimeoutDialogComponent", () => {
  let component: TimeoutDialogComponent;
  let fixture: ComponentFixture<TimeoutDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TimeoutDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    });
    fixture = TestBed.createComponent(TimeoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

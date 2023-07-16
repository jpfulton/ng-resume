import { of } from "rxjs";

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ResumeViewComponent } from "./resume-view.component";

import { EducationService } from "./services/education.service";
import { WorkHistoryService } from "./services/workhistory.service";
import { MatDialogModule } from "@angular/material/dialog";

describe("ResumeViewComponent", () => {
  let fixture: ComponentFixture<ResumeViewComponent>;
  let component: ResumeViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, ResumeViewComponent],
      providers: [
        {
          provide: EducationService,
          useValue: { getAllEducationItems: () => of([]) },
        },
        {
          provide: WorkHistoryService,
          useValue: { getAllWorkHistoryItems: () => of([]) },
        },
      ],
    });

    fixture = TestBed.createComponent(ResumeViewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

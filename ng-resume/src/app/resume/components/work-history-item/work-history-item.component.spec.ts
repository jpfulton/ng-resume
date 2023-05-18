import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHistoryItemComponent } from './work-history-item.component';
import { WorkHistory } from '../../models/workhistory';

/*
class MockWorkHistory implements WorkHistory {
  public startYear = 0;
  endYear: number;
  title: string;
  organization: string;
  organizationURL: URL;
  bullets: string[];
  skills: string[];
}
*/

describe('WorkHistoryItemComponent', () => {
  let component: WorkHistoryItemComponent;
  let fixture: ComponentFixture<WorkHistoryItemComponent>;

  const workHistory: WorkHistory = {
    "startYear": 0,
    "endYear": 0,
    "organization": "Mock org",
    "organizationURL": new URL("https://www.google.com"),
    "title": "Mock title",
    "bullets": [
      "Mock bullet one",
      "Mock bullet two"
    ],
    "skills": [
      "Mock skill one",
      "Mock skill two"
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkHistoryItemComponent]
    });
    fixture = TestBed.createComponent(WorkHistoryItemComponent);
    component = fixture.componentInstance;

    component.workHistory = workHistory;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

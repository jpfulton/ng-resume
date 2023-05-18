import { of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeComponent } from './resume.component';

import { EducationService } from './services/education.service';
import { WorkHistoryService } from './services/workhistory.service';

describe('ResumeComponent', () => {
  let fixture: ComponentFixture<ResumeComponent>;
  let component: ResumeComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ResumeComponent
      ],
      providers: [
        { provide: EducationService, useValue: { getAllEducationItems: () => (of([])) } },
        { provide: WorkHistoryService, useValue: { getAllWorkHistoryItems: () => (of([])) } }
      ]
    });

    fixture = TestBed.createComponent(ResumeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationItemComponent } from './education-item.component';
import { Education } from '../../models/education';

class MockEducation implements Education {
  title: string;
  subtitle: string;
  organization: string;

  constructor(title: string, subtitle: string, organization: string) {
    this.title = title;
    this.subtitle = subtitle;
    this.organization = organization;
  }
}

describe('EducationItemComponent', () => {
  let component: EducationItemComponent;
  let fixture: ComponentFixture<EducationItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EducationItemComponent]
    });
    fixture = TestBed.createComponent(EducationItemComponent);
    component = fixture.componentInstance;

    const education = new MockEducation("Example title", "Example subtitle", "Example org");
    component.education = education;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

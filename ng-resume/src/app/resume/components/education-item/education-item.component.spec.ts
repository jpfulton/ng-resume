import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationItemComponent } from './education-item.component';

describe('EducationItemComponent', () => {
  let component: EducationItemComponent;
  let fixture: ComponentFixture<EducationItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducationItemComponent]
    });
    fixture = TestBed.createComponent(EducationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHistoryItemComponent } from './work-history-item.component';

describe('WorkHistoryItemComponent', () => {
  let component: WorkHistoryItemComponent;
  let fixture: ComponentFixture<WorkHistoryItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkHistoryItemComponent]
    });
    fixture = TestBed.createComponent(WorkHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

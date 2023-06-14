import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestViewComponent } from './test-view.component';

describe('TestViewComponent', () => {
  let component: TestViewComponent;
  let fixture: ComponentFixture<TestViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestViewComponent]
    });
    fixture = TestBed.createComponent(TestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

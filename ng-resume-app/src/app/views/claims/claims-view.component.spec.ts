import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsViewComponent } from './claims-view.component';

describe('ClaimsViewComponent', () => {
  let component: ClaimsViewComponent;
  let fixture: ComponentFixture<ClaimsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClaimsViewComponent]
    });
    fixture = TestBed.createComponent(ClaimsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

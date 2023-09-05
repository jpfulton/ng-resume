import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdWidgetComponent } from './id-widget.component';

describe('IdWidgetComponent', () => {
  let component: IdWidgetComponent;
  let fixture: ComponentFixture<IdWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IdWidgetComponent]
    });
    fixture = TestBed.createComponent(IdWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

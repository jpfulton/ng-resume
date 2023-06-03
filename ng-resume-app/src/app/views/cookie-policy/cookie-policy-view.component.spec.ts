import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiePolicyViewComponent } from './cookie-policy-view.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CookiePolicyViewComponent', () => {
  let component: CookiePolicyViewComponent;
  let fixture: ComponentFixture<CookiePolicyViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CookiePolicyViewComponent
      ]
    });
    fixture = TestBed.createComponent(CookiePolicyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

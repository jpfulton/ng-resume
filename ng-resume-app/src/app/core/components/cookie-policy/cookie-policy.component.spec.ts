import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiePolicyComponent } from './cookie-policy.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CookiePolicyComponent', () => {
  let component: CookiePolicyComponent;
  let fixture: ComponentFixture<CookiePolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CookiePolicyComponent
      ]
    });
    fixture = TestBed.createComponent(CookiePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

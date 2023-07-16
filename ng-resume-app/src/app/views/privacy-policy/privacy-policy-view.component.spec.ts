import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PrivacyPolicyViewComponent } from "./privacy-policy-view.component";
import { RouterTestingModule } from "@angular/router/testing";

describe("PrivacyPolicyViewComponent", () => {
  let component: PrivacyPolicyViewComponent;
  let fixture: ComponentFixture<PrivacyPolicyViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PrivacyPolicyViewComponent],
    });
    fixture = TestBed.createComponent(PrivacyPolicyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

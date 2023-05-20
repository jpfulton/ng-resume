import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Education } from '../../models/education';
import { EducationItemComponent } from './education-item.component';

describe("EducationItemComponent", () => {
  let component: EducationItemComponent;
  let fixture: ComponentFixture<EducationItemComponent>;

  let educationItem: Education; 

  let itemElement: Element | null | undefined;
  let titleElement: Element | null | undefined;
  let subtitleElement: Element | null | undefined;
  let organizationElement: Element | null | undefined;

  /**
   * Queries markup for child elements using component native element.
   * Runs detect change cycle through fixture.
   */
  function populateElementsAndDetectChanges(): void {
    const nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges(); // must bind prior to element access

    itemElement = nativeElement.querySelector("div.education-item");
    titleElement = itemElement?.querySelector("div.education-item-title");
    subtitleElement = itemElement?.querySelector("div.education-item-subtitle");
    organizationElement = itemElement?.querySelector("div.education-item-organization");
  }

  /**
   * Populate component inputs with mock data.
   */
  function populateComponentInputs(): void {
    component.education = educationItem;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EducationItemComponent]
    });
    fixture = TestBed.createComponent(EducationItemComponent);

    component = fixture.componentInstance;

    // fill out all properties in the model class before each run, 
    // tests should assign undefined to properties to test for conditional display
    // in the test function
    educationItem = {
      organization: "Mock org",
      subtitle: "Mock subtitle",
      title: "Mock title"
    };
  });

  it("should create", () => {
    populateComponentInputs();
    populateElementsAndDetectChanges();

    expect(component).toBeTruthy();
  });

  it("should have values in all child elements", () => {
    populateComponentInputs();
    populateElementsAndDetectChanges();

    expect(titleElement).toBeTruthy();
    expect(subtitleElement).toBeTruthy();
    expect(organizationElement).toBeTruthy();

    expect(titleElement?.textContent).toEqual(educationItem.title);
    expect(subtitleElement?.textContent).toEqual(educationItem.subtitle);
    expect(organizationElement?.textContent).toEqual(educationItem.organization);
  });

  it("should not render subtitle element", () => {
    populateComponentInputs();

    component.education.subtitle = undefined; // uninitialize mock data for this property
    populateElementsAndDetectChanges();

    expect(titleElement).toBeTruthy();
    expect(subtitleElement).toBeFalsy(); // no data in property on input, should not render
    expect(organizationElement).toBeTruthy();

    expect(titleElement?.textContent).toEqual(educationItem.title);
    expect(organizationElement?.textContent).toEqual(educationItem.organization);
  });

  it("should not render organization element", () => {
    populateComponentInputs();

    component.education.organization = undefined; // uninitialize mock data for this property
    populateElementsAndDetectChanges();

    expect(titleElement).toBeTruthy();
    expect(subtitleElement).toBeTruthy(); 
    expect(organizationElement).toBeFalsy(); // no data in property on input parameter, should not render

    expect(titleElement?.textContent).toEqual(educationItem.title);
    expect(subtitleElement?.textContent).toEqual(educationItem.subtitle);
  });
});

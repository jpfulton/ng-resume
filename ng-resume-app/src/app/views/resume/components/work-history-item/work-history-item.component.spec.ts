import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkHistoryItemComponent } from "./work-history-item.component";
import { WorkHistory } from "@jpfulton/ng-resume-api-browser-sdk/types/api";

describe("WorkHistoryItemComponent", () => {
  let component: WorkHistoryItemComponent;
  let fixture: ComponentFixture<WorkHistoryItemComponent>;

  let workHistoryItem: WorkHistory;

  let itemElement: Element | null | undefined;
  let dateRangeElement: Element | null | undefined;
  let titleElement: Element | null | undefined;
  let organizationAnchorElement: Element | null | undefined;
  let organizationWithoutAnchorElement: Element | null | undefined;
  let bulletsLiNodeList: NodeListOf<Element> | undefined;
  let skillsLiNodeList: NodeListOf<Element> | undefined;

  /**
   * Queries markup for child elements using component native element.
   * Runs detect change cycle through fixture.
   */
  function populateElementsAndDetectChanges(): void {
    const nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges(); // must bind prior to element access

    itemElement = nativeElement.querySelector("div.work-history");
    dateRangeElement = itemElement?.querySelector(
      "div.work-history-date-range",
    );
    titleElement = itemElement?.querySelector(
      "div.work-history-body > div.work-history-title",
    );
    organizationAnchorElement = itemElement?.querySelector(
      "div.work-history-body > div > div.work-history-org > span > a",
    );
    organizationWithoutAnchorElement = itemElement?.querySelector(
      "div.work-history-body > div > div.work-history-org > span.no-org-url",
    );

    bulletsLiNodeList = itemElement?.querySelectorAll(
      "div.work-history-body > div > div.work-history-bullet-list > ol > li",
    );
    skillsLiNodeList = itemElement?.querySelectorAll(
      "div.work-history-body > div > div.work-history-skill-list > ol > li",
    );
  }

  /**
   * Populate component inputs with mock data.
   */
  function populateComponentInputs(): void {
    component.workHistory = workHistoryItem;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkHistoryItemComponent],
    });
    fixture = TestBed.createComponent(WorkHistoryItemComponent);
    component = fixture.componentInstance;

    // fill out all properties in the model class before each run,
    // tests should assign undefined to properties to test for conditional display
    // in the test function
    workHistoryItem = {
      id: "6df24b89-99c6-4af6-b064-b507b2533828",
      startYear: 0,
      endYear: 0,
      organization: "Mock org",
      organizationUrl: "https://www.google.com",
      title: "Mock title",
      bullets: ["Mock bullet one", "Mock bullet two"],
      skills: ["Mock skill one", "Mock skill two"],
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

    expect(dateRangeElement).toBeTruthy();
    expect(titleElement).toBeTruthy();
    expect(organizationAnchorElement).toBeTruthy();
    expect(organizationWithoutAnchorElement).toBeFalsy(); // should not render when data obejct is full

    expect(dateRangeElement?.textContent?.trim()).toEqual(
      workHistoryItem.startYear + " - " + workHistoryItem.endYear,
    );
    expect(titleElement?.textContent).toEqual(workHistoryItem.title);
    expect(organizationAnchorElement?.textContent).toEqual(
      " " + workHistoryItem.organization + " open_in_new",
    );
    expect(
      organizationAnchorElement?.attributes.getNamedItem("href")?.value ?? "",
    ).toEqual(workHistoryItem?.organizationUrl ?? "");

    expect(bulletsLiNodeList?.length).toEqual(2);
    expect(bulletsLiNodeList?.item(0).textContent).toEqual(
      workHistoryItem.bullets && workHistoryItem.bullets[0],
    );
    expect(bulletsLiNodeList?.item(1).textContent).toEqual(
      workHistoryItem.bullets && workHistoryItem.bullets[1],
    );

    expect(skillsLiNodeList?.length).toEqual(2);
    expect(skillsLiNodeList?.item(0).textContent?.trim()).toEqual(
      workHistoryItem.skills && workHistoryItem.skills[0],
    );
    expect(skillsLiNodeList?.item(1).textContent?.trim()).toEqual(
      "| " + (workHistoryItem.skills && workHistoryItem.skills[1]),
    );
  });

  it("should have values in all child elements with no organization URL", () => {
    populateComponentInputs();

    component.workHistory.organizationUrl = undefined; // uninitialize org url
    populateElementsAndDetectChanges();

    expect(dateRangeElement).toBeTruthy();
    expect(titleElement).toBeTruthy();
    expect(organizationAnchorElement).toBeFalsy(); // should not render
    expect(organizationWithoutAnchorElement).toBeTruthy();

    expect(dateRangeElement?.textContent?.trim()).toEqual(
      workHistoryItem.startYear + " - " + workHistoryItem.endYear,
    );
    expect(titleElement?.textContent).toEqual(workHistoryItem.title);
    expect(organizationWithoutAnchorElement?.textContent).toEqual(
      workHistoryItem.organization,
    );

    expect(bulletsLiNodeList?.length).toEqual(2);
    expect(bulletsLiNodeList?.item(0).textContent).toEqual(
      workHistoryItem.bullets && workHistoryItem.bullets[0],
    );
    expect(bulletsLiNodeList?.item(1).textContent).toEqual(
      workHistoryItem.bullets && workHistoryItem.bullets[1],
    );

    expect(skillsLiNodeList?.length).toEqual(2);
    expect(skillsLiNodeList?.item(0).textContent?.trim()).toEqual(
      workHistoryItem.skills && workHistoryItem.skills[0],
    );
    expect(skillsLiNodeList?.item(1).textContent?.trim()).toEqual(
      "| " + (workHistoryItem.skills && workHistoryItem.skills[1]),
    );
  });
});

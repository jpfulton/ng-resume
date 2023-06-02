import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WorkHistory } from '../models/workhistory';
import { WorkHistoryService } from './workhistory.service';
import { RestApiLocations } from '../enums/rest-api-locations';

describe("WorkhistoryService", () => {
  let httpTestingController: HttpTestingController;
  let service: WorkHistoryService;

  const dataSourceLocation = RestApiLocations.WorkHistory;
  const responseData: WorkHistory[] = [
    {
      id: "874874ae-7b3b-44c7-b19a-9c3187f15835",
      bullets: ["Bullet one", "Bullet two"],
      endYear: 2001,
      organization: "Mock org",
      organizationURL: new URL("https://www.google.com/"),
      skills: ["Skill one", "Skill two"],
      startYear: 2002,
      title: "Mock title"
    },
    {
      id: "ee17fbf3-73b3-477f-b1a7-3d3431569253",
      bullets: ["Bullet one", "Bullet two"],
      endYear: 2001,
      organization: "Mock org 2",
      organizationURL: new URL("https://www.google.com/"),
      skills: ["Skill one", "Skill two"],
      startYear: 2002,
      title: "Mock title 2"
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WorkHistoryService);
  });

  afterEach(() => {
    // assert no more pending requests
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return work history objects from HttpClient GET", () => {
    service.getAllWorkHistoryItems()
      .subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
          expect(response.length).toBeGreaterThan(0);
        }
      });

    const requestMock = httpTestingController.expectOne(dataSourceLocation);
    const request = requestMock.request;

    expect(request.method).toEqual("GET");

    requestMock.flush(responseData);
  });

  // Simulates a 401 (unauthorized) response from the HttpClient request.
  // While this won't occur when serving JSON data sources from a static local folder
  // in the current design, the test case proves error handling and provides a useful pattern
  // for a future expanded design.
  it("should return error message from work history request", () => {
    service.getAllWorkHistoryItems()
      .subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.status).withContext("status").toEqual(401);
        }
      });

    const requestMock = httpTestingController.expectOne(dataSourceLocation);
    const request = requestMock.request;

    expect(request.method).toEqual("GET");

    requestMock.flush("error request", { status: 401, statusText: "Unauthorized access"});
  });
});

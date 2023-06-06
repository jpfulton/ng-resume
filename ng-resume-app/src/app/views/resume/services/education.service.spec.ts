import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Education } from '../models/education';
import { EducationService } from './education.service';
import { RestApiLocations } from '../enums/rest-api-locations';

describe("EducationService", () => {
  let httpTestingController: HttpTestingController;
  let service: EducationService;

  const dataSourceLocation = RestApiLocations.Education;
  const responseData: Education[] = [
    {
      id: "8c2ee1a8-96d4-4ef3-a2cb-92eada889474",
      title: "Mock title",
      subtitle: "Mock subtitle",
      organization: "Mock org"
    },
    {
      id: "66337f2d-a9c5-448d-a52d-82320d716139",
      title: "Mock title2",
      subtitle: "Mock subtitle2",
      organization: "Mock org2"
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EducationService);
  });

  afterEach(() => {
    // assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return education objects from HttpClient GET", () => {
    service.getAllEducationItems()
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
  it("should return error message from education request", () => {
    service.getAllEducationItems()
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
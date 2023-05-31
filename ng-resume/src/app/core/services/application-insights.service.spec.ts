import { TestBed } from '@angular/core/testing';

import { ApplicationInsightsService } from './application-insights.service';

describe('ApplicationInsightsService', () => {
  let service: ApplicationInsightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationInsightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EducationService } from './education.service';

describe("EducationService", () => {
  let service: EducationService;

  beforeEach(async () => {
    service = TestBed.inject(EducationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

});

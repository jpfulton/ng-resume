import { TestBed } from "@angular/core/testing";

import { EducationService } from "./education.service";
import { MatDialogModule } from "@angular/material/dialog";

describe("EducationService", () => {
  let service: EducationService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
    });
    service = TestBed.inject(EducationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

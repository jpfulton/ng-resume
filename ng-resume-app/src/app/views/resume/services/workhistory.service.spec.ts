import { TestBed } from '@angular/core/testing';

import { WorkHistoryService } from './workhistory.service';
import { MatDialogModule } from '@angular/material/dialog';

describe("WorkhistoryService", () => {
  let service: WorkHistoryService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule
      ]
    });
    service = TestBed.inject(WorkHistoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

});

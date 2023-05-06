import { TestBed } from '@angular/core/testing';

import { WorkHistoryService } from './workhistory.service';

describe('WorkhistoryService', () => {
  let service: WorkHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

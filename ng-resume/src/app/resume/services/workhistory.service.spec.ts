import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { WorkHistoryService } from './workhistory.service';

describe('WorkhistoryService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let service: WorkHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    service = new WorkHistoryService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

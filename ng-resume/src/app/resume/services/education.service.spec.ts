import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { EducationService } from './education.service';

describe('EducationService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let service: EducationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    service = new EducationService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

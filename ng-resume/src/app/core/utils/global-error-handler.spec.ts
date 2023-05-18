import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    handler = TestBed.inject(GlobalErrorHandler);
  });

  it('should create an instance', () => {
    expect(handler).toBeTruthy();
  });
});

import { TestBed } from "@angular/core/testing";
import { GlobalErrorHandler } from "./global-error-handler";
import { MatDialogModule } from "@angular/material/dialog";

describe("GlobalErrorHandler", () => {
  let handler: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
    });
    handler = TestBed.inject(GlobalErrorHandler);
  });

  it("should create an instance", () => {
    expect(handler).toBeTruthy();
  });
});

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  getClientMessage(error: Error) : string {
    if (!navigator.onLine) {
      return 'No internet connection.';
    }

    return error.message ? error.message : error.toString();
  }

  getClientStacktrace(error: Error) : string {
    return error.stack ?? "Stack unavailable.";
  }

  getServerMessage(error: HttpErrorResponse) : string {
    return "Response Status: " + error.status + " Message: " + error.message;
  }

  getServerStacktrace(error: HttpErrorResponse) : string {
    return error.error.toString();
  }
}

import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

/**
 * Service to encapsulate logic surrounding the processing of client
 * and server errors.
 */
@Injectable({
  providedIn: "root",
})
export class ErrorService {
  /**
   * Separate the client error message.
   * @param {Error} error Client error object.
   * @returns {string} A message contructed from the error parameter.
   */
  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
      return "No internet connection.";
    }

    return error.message ? error.message : error.toString();
  }

  /**
   * Get the stacktrace from the client error object.
   * @param {Error} error Client error object.
   * @returns {string} Client error stacktrace as a string.
   */
  getClientStacktrace(error: Error): string {
    return error.stack ?? "Stack unavailable.";
  }

  /**
   * Get a server error message.
   * @param {HttpErrorResponse} error Server error object.
   * @returns {string} Server error message as a string.
   */
  getServerMessage(error: HttpErrorResponse): string {
    return "Response Status: " + error.status + " Message: " + error.message;
  }

  /**
   * Returns the server stacktrace. Placeholder method. Some APIs may return
   * this and others may not. Often it can be stored in the response body.
   * @param {HttpErrorResponse} error Server side error object.
   * @returns {string} Server side stack trace if available.
   */
  getServerStacktrace(error: HttpErrorResponse): string {
    return error.error.toString();
  }
}

import { Injectable } from '@angular/core';

/**
 * Service to encapsulate logging functionality. Currently logs to console.
 * Additional logging targets can be added here. (e.g. Azure AppInsights, etc.)
 */
@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  /**
   * Log an error message and optional stack trace.
   * @param {string} message Log message.
   * @param {string} stackTrace Optional stack trace.
   */
  logError(message: string, stackTrace?: string) {

    // avoid logging stackTrace to console, leave available for other log targets
    console.log("LoggingService: " + message);
  }
}

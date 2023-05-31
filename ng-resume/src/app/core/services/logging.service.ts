import { Injectable } from '@angular/core';

import { ApplicationInsightsService } from './application-insights.service';

/**
 * Service to encapsulate logging functionality. Currently logs to console
 * and Azure Application Insights.
 * Additional logging targets can be added here. (e.g. Splunk, etc.)
 */
@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(
    private applicationInsightsService: ApplicationInsightsService
  )
  { }

  /**
   * Logs a trace message.
   * @param {string} message Message for trace.
   */
  logTrace(message: string) {
    this.applicationInsightsService.logTrace(message);
    console.trace("LoggingService: [trace] " + message);
  }

  /**
   * Log an error message and optional stack trace.
   * @param {string} message Log message.
   * @param {string} stackTrace Optional stack trace.
   */
  logError(message: string, stackTrace?: string) {
    // send to application insights
    this.applicationInsightsService.logException(new Error(message, { cause: stackTrace }));

    // avoid logging stackTrace to console on browser, leave available for other log targets
    console.log("LoggingService: [error]" + message);
  }
}

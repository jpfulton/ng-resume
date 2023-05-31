import { Injectable } from '@angular/core';

import { ApplicationInsightsService } from './application-insights.service';

/**
 * Service to encapsulate logging functionality. Currently logs to console
 * and Azure Application Insights.
 * 
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
   * Logs a debug message.
   * @param {string} message Message for debug log.
   */
  logDebug(message: string) {
    console.debug("LoggingService: [debug] " + message);
  }

  /**
   * Logs an info message.
   * @param {string} message Message for info log.
   */
  logInfo(message: string) {
    console.info("LoggingService: [info] " + message);
  }

  /**
   * Logs an warn message.
   * @param {string} message Message for warn log.
   */
  logWarn(message: string) {
    console.warn("LoggingService: [warn] " + message);
  }

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
    this.applicationInsightsService.logException(new Error(message, { cause: stackTrace }));
    console.error("LoggingService: [error]" + message);
  }
}

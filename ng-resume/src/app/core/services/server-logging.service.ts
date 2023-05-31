import { Injectable } from '@angular/core';

import { LoggingService } from './logging.service';

/**
 * Logging service implementation for SSR.
 */
@Injectable({
  providedIn: 'root'
})
export class ServerLoggingService extends LoggingService {

  /**
   * Logs a trace message.
   * @param {string} message Message for trace.
   */
  override logTrace(message: string) {
    console.trace("LoggingService: [trace] " + message);
  }

  /**
   * Log an error message and optional stack trace.
   * @param {string} message Log message.
   * @param {string} stackTrace Optional stack trace.
   */
  override logError(message: string, stackTrace?: string) {
    console.log("ServerLoggingService: [error] " + message);
    if (stackTrace !== undefined) console.log(stackTrace);
  }
}

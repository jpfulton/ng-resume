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
   * Log an error message and optional stack trace.
   * @param {string} message Log message.
   * @param {string} stackTrace Optional stack trace.
   */
  override logError(message: string, stackTrace?: string) {

    // avoid logging stackTrace to console, leave available for other log targets
    console.log("ServerLoggingService: " + message);
    if (stackTrace !== undefined) console.log(stackTrace);
  }
}

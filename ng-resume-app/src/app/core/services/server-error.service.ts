import { Injectable } from '@angular/core';
import { ErrorService } from './error.service';

/**
 * Error service implementation for SSR module.
 */
@Injectable({
  providedIn: 'root'
})
export class ServerErrorService extends ErrorService {

  /**
   * Separate the client error message.
   * @param {Error} error Client error object.
   * @returns {string} A message contructed from the error parameter.
   */
  override getClientMessage(error: Error) : string {
    return error.message ? error.message : error.toString();
  }  
}

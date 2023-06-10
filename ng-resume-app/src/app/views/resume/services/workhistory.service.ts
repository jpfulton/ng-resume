import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { NgResumeApiClient } from '@jpfulton/ng-resume-api-browser-sdk';
import { WorkHistory } from '@jpfulton/ng-resume-api-browser-sdk/api';

/**
 * Service to access WorkHistory objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class WorkHistoryService {
  
  private apiClient: NgResumeApiClient = new NgResumeApiClient({});

  /**
   * Get all work history objects from a remote data source.
   * @returns {Observable<WorkHistory[]>} An observable array of WorkHistory objects.
   */
  getAllWorkHistoryItems() : Observable<WorkHistory[]> {
    return from(this.apiClient.workhistory.getAll());
  }
}

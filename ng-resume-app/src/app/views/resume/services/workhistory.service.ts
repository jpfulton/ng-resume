import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgResumeApiClient } from '@jpfulton/ng-resume-api-browser-sdk';
import { WorkHistory } from '@jpfulton/ng-resume-api-browser-sdk/api';
import { LoadingService } from 'src/app/core/services/loading.service';
import { apiPromiseToObservableWithRetry } from 'src/app/core/utils/api-helpers';

/**
 * Service to access WorkHistory objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class WorkHistoryService {
  private apiClient: NgResumeApiClient = new NgResumeApiClient({});

  constructor(private loadingService: LoadingService) { }

  /**
   * Get all work history objects from a remote data source.
   * @returns {Observable<WorkHistory[]>} An observable array of WorkHistory objects.
   */
  getAllWorkHistoryItems(): Observable<WorkHistory[]> {
    return apiPromiseToObservableWithRetry(() => this.apiClient.workhistory.getAll(), this.loadingService);
  }
}

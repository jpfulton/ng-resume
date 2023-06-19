import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WorkHistory } from '@jpfulton/ng-resume-api-browser-sdk/api';
import { LoadingService } from 'src/app/core/services/loading.service';
import { apiPromiseToObservableWithRetry, getAnonymousApiClient } from 'src/app/core/utils/api-helpers';

/**
 * Service to access WorkHistory objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class WorkHistoryService {
  constructor(private loadingService: LoadingService) { }

  /**
   * Get all work history objects from a remote data source.
   * @returns {Observable<WorkHistory[]>} An observable array of WorkHistory objects.
   */
  getAllWorkHistoryItems(): Observable<WorkHistory[]> {
    return apiPromiseToObservableWithRetry(() => getAnonymousApiClient().workhistory.getAll(), this.loadingService);
  }
}

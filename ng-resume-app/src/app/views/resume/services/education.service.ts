import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgResumeApiClient } from '@jpfulton/ng-resume-api-browser-sdk';
import { Education } from '@jpfulton/ng-resume-api-browser-sdk/api';
import { LoadingService } from 'src/app/core/services/loading.service';
import { apiPromiseToObservableWithRetry } from 'src/app/core/utils/api-helpers';

/**
 * Service to access Education objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private apiClient: NgResumeApiClient = new NgResumeApiClient({});

  constructor(private loadingService: LoadingService) { }

  /**
   * Get all education objects from remote datasource.
   * @returns {Observable<Education[]>} An observable array of Education objects.
   */
  getAllEducationItems(): Observable<Education[]> {
    return apiPromiseToObservableWithRetry(() => this.apiClient.education.getAll(), this.loadingService);
  }
}

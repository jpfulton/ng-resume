import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { JpfultonApiClient } from '@jpfulton/ng-resume-api-browser-sdk';
import { Education } from '@jpfulton/ng-resume-api-browser-sdk/api';

/**
 * Service to access Education objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class EducationService {

  private client: JpfultonApiClient = new JpfultonApiClient({});

  /**
   * Get all education objects from remote datasource.
   * @returns {Observable<Education[]>} An observable array of Education objects.
   */
  getAllEducationItems() : Observable<Education[]> {
    return from(this.client.education.getAll());
  }
}

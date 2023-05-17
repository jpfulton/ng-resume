import { Injectable, inject } from '@angular/core';
import { Education } from '../models/education';
import { LocalDataSourceLocations } from '../enums/local-data-source-locations';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Service to access Education objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class EducationService {
  httpClient: HttpClient = inject(HttpClient);

  /**
   * Get all education objects from remote datasource.
   * @returns {Observable<Education[]>} An observable array of Education objects.
   */
  getAllEducationItems() : Observable<Education[]> {
    return this.httpClient.get<Education[]>(LocalDataSourceLocations.Education);
  }
}

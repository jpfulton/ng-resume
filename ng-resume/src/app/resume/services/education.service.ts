import { Injectable } from '@angular/core';
import { Education } from '../models/education';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestApiLocations } from '../enums/rest-api-locations';

/**
 * Service to access Education objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class EducationService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get all education objects from remote datasource.
   * @returns {Observable<Education[]>} An observable array of Education objects.
   */
  getAllEducationItems() : Observable<Education[]> {
    return this.httpClient.get<Education[]>(RestApiLocations.Education);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkHistory } from '../models/workhistory';
import { Observable } from 'rxjs';
import { RestApiLocations } from '../enums/rest-api-locations';

/**
 * Service to access WorkHistory objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class WorkHistoryService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get all work history objects from a remote data source.
   * @returns {Observable<WorkHistory[]>} An observable array of WorkHistory objects.
   */
  getAllWorkHistoryItems() : Observable<WorkHistory[]> {
    return this.httpClient.get<WorkHistory[]>(RestApiLocations.WorkHistory);
  }
}

import { Injectable } from '@angular/core';
import { LocalDataSourceLocations } from '../enums/local-data-source-locations';
import { WorkHistory } from '../models/workhistory';

/**
 * Service to access WorkHistory objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class WorkHistoryService {

  /**
   * Get all work history objects from a remote data source.
   * @returns {Promise<WorkHistory[]>} An array of WorkHistory objects.
   */
  async getAllWorkHistoryItems() : Promise<WorkHistory[]> {
    const responseData = await fetch(LocalDataSourceLocations.WorkHistory);
    return await responseData.json() ?? [];
  }
}

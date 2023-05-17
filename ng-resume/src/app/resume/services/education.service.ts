import { Injectable } from '@angular/core';
import { Education } from '../models/education';
import { LocalDataSourceLocations } from '../enums/local-data-source-locations';

/**
 * Service to access Education objects from a remote source.
 */
@Injectable({
  providedIn: 'root'
})
export class EducationService {

  /**
   * Get all education objects from remote datasource.
   * @returns {Promise<Education[]>} An array of Education objects.
   */
  async getAllEducationItems() : Promise<Education[]> {
    const responseData = await fetch(LocalDataSourceLocations.Education);
    return await responseData.json() ?? [];
  }
}

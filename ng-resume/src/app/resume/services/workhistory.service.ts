import { Injectable } from '@angular/core';
import { WorkHistory } from '../models/workhistory';

@Injectable({
  providedIn: 'root'
})
export class WorkHistoryService {

  url = "./assets/static/workhistory.json"

  constructor() { }

  async getAllWorkHistoryItems() : Promise<WorkHistory[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }
}

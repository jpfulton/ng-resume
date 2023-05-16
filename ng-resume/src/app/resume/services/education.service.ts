import { Injectable } from '@angular/core';
import { Education } from '../models/education';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  url = './assets/static/education.json'

  async getAllEducationItems() : Promise<Education[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }
}

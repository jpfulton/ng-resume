import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkHistory } from '../models/workhistory';

@Component({
  selector: 'component-work-history-item',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './work-history-item.component.html',
  styleUrls: ['./work-history-item.component.scss']
})
export class WorkHistoryItemComponent {
  @Input() workHistory!: WorkHistory;
  /*workHistory: WorkHistory = {
    startYear: 2000,
    endYear: 2010,
    title: 'Job Title',
    organization: 'Example Company',
    organizationURL: new URL('https://www.google.com/'),
    bullets: [
      'Example accomplishment one.',
      'Example accomplishment two.',
    ]
  };*/
}

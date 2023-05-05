import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkHistoryItemComponent } from './work-history-item/work-history-item.component';
import { WorkHistory } from './models/workhistory';

@Component({
  selector: 'component-resume',
  standalone: true,
  imports: [
    CommonModule,
    WorkHistoryItemComponent,
  ],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent {
  workHistoryList: WorkHistory[] = [
    {
      startYear: 2000,
      endYear: 2002,
      organization: 'Org One',
      organizationURL: new URL('https://www.google.com'),
      title: 'Title One',
      bullets: [
        'Accomplishment A',
        'Accomplishment B',
      ],
    },
    {
      startYear: 2002,
      endYear: 2006,
      organization: 'Org Two',
      organizationURL: new URL('https://www.google.com'),
      title: 'Title Two',
      bullets: [
        'Accomplishment A1',
        'Accomplishment B1',
      ],
    },
  ];
}

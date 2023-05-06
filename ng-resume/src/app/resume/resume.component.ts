import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkHistoryItemComponent } from './work-history-item/work-history-item.component';
import { WorkHistory } from './models/workhistory';
import { WorkHistoryService } from './services/workhistory.service';

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
  workHistoryList: WorkHistory[] = [];
  workHistoryService: WorkHistoryService = inject(WorkHistoryService);
  
  constructor() {

    this.workHistoryService.getAllWorkHistoryItems()
      .then((workHistoryList: WorkHistory[]) => {this.workHistoryList = workHistoryList});

  }
}

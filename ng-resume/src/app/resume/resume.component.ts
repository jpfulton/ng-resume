import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkHistoryItemComponent } from './components/work-history-item/work-history-item.component';
import { WorkHistory } from './models/workhistory';
import { WorkHistoryService } from './services/workhistory.service';
import { Education } from './models/education';
import { EducationService } from './services/education.service';
import { EducationItemComponent } from './components/education-item/education-item.component';

/**
 * Top level component for the resume view heirarchy.
 */
@Component({
  selector: 'app-component-resume',
  standalone: true,
  imports: [
    CommonModule,
    EducationItemComponent,
    WorkHistoryItemComponent,
  ],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  providers: [
    EducationService,
    WorkHistoryService
  ]
})
export class ResumeComponent {
  educationList: Education[] = [];
  workHistoryList: WorkHistory[] = [];

  constructor(educationService: EducationService, workHistoryService: WorkHistoryService)
  {
    educationService.getAllEducationItems().subscribe(data => this.educationList = data);
    workHistoryService.getAllWorkHistoryItems().subscribe(data => this.workHistoryList = data);
  }
}

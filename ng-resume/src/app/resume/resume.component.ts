import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkHistoryItemComponent } from './components/work-history-item/work-history-item.component';
import { WorkHistory } from './models/workhistory';
import { WorkHistoryService } from './services/workhistory.service';
import { Education } from './models/education';
import { EducationService } from './services/education.service';
import { EducationItemComponent } from './components/education-item/education-item.component';
import { Subscription } from 'rxjs';

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
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit, OnDestroy {
  educationList: Education[] = [];
  educationSubscription: Subscription | undefined;
  educationService: EducationService = inject(EducationService);

  workHistoryList: WorkHistory[] = [];
  workHistorySubscription: Subscription | undefined;
  workHistoryService: WorkHistoryService = inject(WorkHistoryService);

  ngOnInit() : void {
    this.workHistorySubscription =
      this.workHistoryService.getAllWorkHistoryItems()
        .subscribe(data => this.workHistoryList = data);

    this.educationSubscription =
      this.educationService.getAllEducationItems()
        .subscribe(data => this.educationList = data);
  }

  ngOnDestroy() : void {
    this.workHistorySubscription?.unsubscribe();
    this.educationSubscription?.unsubscribe();
  }
}

import { Subscription } from 'rxjs';

import { isPlatformServer } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnDestroy, OnInit } from '@angular/core';
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
export class ResumeComponent implements OnInit, OnDestroy {
  educationList: Education[] = [];
  workHistoryList: WorkHistory[] = [];

  private educationSubscription: Subscription | null = null;
  private workHistorySubscription: Subscription | null = null;

  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private platformId: Object,
    private educationService: EducationService, 
    private workHistoryService: WorkHistoryService
    )
  {
  }

  ngOnInit(): void {
    if (!isPlatformServer(this.platformId)) {
      this.educationSubscription = this.educationService.getAllEducationItems().subscribe(data => this.educationList = data);
      this.workHistorySubscription = this.workHistoryService.getAllWorkHistoryItems().subscribe(data => this.workHistoryList = data);
    }
  }

  ngOnDestroy(): void {
    this.educationSubscription?.unsubscribe();
    this.workHistorySubscription?.unsubscribe();
  }
}

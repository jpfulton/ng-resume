import { Subscription } from "rxjs";

import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgIf, NgFor } from "@angular/common";

import { MatIconModule } from "@angular/material/icon";

import { WorkHistoryItemComponent } from "./components/work-history-item/work-history-item.component";
import { WorkHistoryService } from "./services/workhistory.service";

import { EducationService } from "./services/education.service";
import { EducationItemComponent } from "./components/education-item/education-item.component";
import { PlatformService } from "../../core/services/platform.service";
import { LoggingService } from "../../core/services/logging.service";

import { Education } from "@jpfulton/ng-resume-api-browser-sdk/types/api";
import { WorkHistory } from "@jpfulton/ng-resume-api-browser-sdk/types/api";

/**
 * Top level component for the resume view heirarchy.
 */
@Component({
  selector: "app-resume",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatIconModule,
    EducationItemComponent,
    WorkHistoryItemComponent,
  ],
  templateUrl: "./resume-view.component.html",
  styleUrls: ["./resume-view.component.scss"],
  providers: [EducationService, WorkHistoryService, PlatformService],
})
export class ResumeViewComponent implements OnInit, OnDestroy {
  educationList: Education[] = [];
  workHistoryList: WorkHistory[] = [];

  private educationSubscription: Subscription | null = null;
  private workHistorySubscription: Subscription | null = null;

  constructor(
    private educationService: EducationService,
    private workHistoryService: WorkHistoryService,
    private platformService: PlatformService,
    private loggingService: LoggingService,
  ) {}

  trackEductionById(index: number, item: Education) {
    return item.id;
  }

  trackWorkHistoryById(index: number, item: WorkHistory) {
    return item.id;
  }

  ngOnInit(): void {
    if (this.platformService.isBrowser()) {
      this.loggingService.logDebug("Platform is browser.");

      this.loggingService.logDebug("Loading remote education source data.");
      this.educationSubscription = this.educationService
        .getAllEducationItems()
        .subscribe((data) => (this.educationList = data));

      this.loggingService.logDebug("Loading remote work history source data.");
      this.workHistorySubscription = this.workHistoryService
        .getAllWorkHistoryItems()
        .subscribe((data) => (this.workHistoryList = data));
    }
  }

  ngOnDestroy(): void {
    this.educationSubscription?.unsubscribe();
    this.workHistorySubscription?.unsubscribe();
  }
}

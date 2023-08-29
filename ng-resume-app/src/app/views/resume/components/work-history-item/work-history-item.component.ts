import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatIconModule } from "@angular/material/icon";

import { WorkHistory } from "@jpfulton/ng-resume-api-browser-sdk/types/api";

/**
 * Component to render elements in the resume work history section.
 */
@Component({
  selector: "app-work-history-item",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./work-history-item.component.html",
  styleUrls: ["./work-history-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkHistoryItemComponent {
  @Input() workHistory!: WorkHistory;
}

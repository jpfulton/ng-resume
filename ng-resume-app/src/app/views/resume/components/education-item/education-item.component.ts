import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Education } from "@jpfulton/ng-resume-api-browser-sdk/types/api";

/**
 * Component to render elements in the resume education and certification section.
 */
@Component({
  selector: "app-education-item",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./education-item.component.html",
  styleUrls: ["./education-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationItemComponent {
  @Input() education!: Education;
}

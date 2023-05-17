import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkHistory } from '../../models/workhistory';

/**
 * Component to render elements in the resume work history section.
 */
@Component({
  selector: 'app-component-work-history-item',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './work-history-item.component.html',
  styleUrls: ['./work-history-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkHistoryItemComponent {
  @Input() workHistory!: WorkHistory;
}

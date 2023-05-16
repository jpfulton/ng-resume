import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkHistory } from '../../models/workhistory';

@Component({
  selector: 'app-component-work-history-item',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './work-history-item.component.html',
  styleUrls: ['./work-history-item.component.scss']
})
export class WorkHistoryItemComponent {
  @Input() workHistory!: WorkHistory;
}

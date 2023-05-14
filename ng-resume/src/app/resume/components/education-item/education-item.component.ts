import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Education } from '../../models/education';

@Component({
  selector: 'component-education-item',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './education-item.component.html',
  styleUrls: ['./education-item.component.scss']
})
export class EducationItemComponent {
  @Input() education!: Education;
}

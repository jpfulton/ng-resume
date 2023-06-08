import { Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
 
import { FocusableDirective } from '../../directives/focusable.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    MatToolbarModule, 
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    FocusableDirective
  ]
})
export class HeaderComponent {
  @ViewChild("darkModeToggle") darkModeToggle!: MatSlideToggle;
}

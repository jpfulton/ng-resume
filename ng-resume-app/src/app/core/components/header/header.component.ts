/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
 
import { FocusableDirective } from '../../directives/focusable.directive';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

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
    MatCardModule,
    FocusableDirective
  ]
})
export class HeaderComponent implements OnInit {
  @ViewChild("darkModeToggle") darkModeToggle!: MatSlideToggle;

  user: User | undefined;

  constructor(
    public authService: AuthService
  )
  { 
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.user = this.authService.getActiveUser();
    }
  }

  logout(): void {
    this.authService.logout();
    this.user = undefined;
  }

  login(): void {
    this.authService.login();
    this.user = this.authService.getActiveUser();
  }

}

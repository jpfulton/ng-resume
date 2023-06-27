/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
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
import { LocalUser } from '../../models/local-user';

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
export class HeaderComponent {
  @ViewChild("darkModeToggle") darkModeToggle!: MatSlideToggle;

  user: LocalUser | undefined;

  constructor(
    public authService: AuthService
  )
  { 
  }

  logout(): void {
    this.authService.logout();
    this.user = undefined;
  }

  login(): void {
    this.authService.login();

    if (this.authService.isLoggedIn) {
      this.authService.getActiveUser().then((result) => this.user = result);
    }
  }

  profileMenuOpening(): void {
    if (this.authService.isLoggedIn) {
      this.authService.getActiveUser().then((result) => this.user = result);
    }
  }

}

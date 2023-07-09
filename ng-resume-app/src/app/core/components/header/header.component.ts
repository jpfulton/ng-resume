/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
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
import { AccountInfo } from '@azure/msal-common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  account: AccountInfo | undefined;

  constructor(
    public authService: AuthService
  )
  { 
  }

  logout(): void {
    this.authService.logout();
    this.account = undefined;
  }

  login(): void {
    this.authService.login();

    if (this.authService.isLoggedIn) {
      this.account = this.authService.getActiveAccount();
    }
  }

  profileMenuOpening(): void {
    if (this.authService.isLoggedIn) {
      this.account = this.authService.getActiveAccount();
    }
  }

}

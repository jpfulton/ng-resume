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
 
import { FocusableDirective } from '../../directives/focusable.directive';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventType, EventMessage, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { b2cPolicies } from '../../constants/auth-constants';
import { AuthenticationResult, PromptValue } from '@azure/msal-common';
import { filter } from 'rxjs';


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
export class HeaderComponent implements OnInit {
  @ViewChild("darkModeToggle") darkModeToggle!: MatSlideToggle;

  loginDisplay = false;

  constructor(
    private msalAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
          .pipe(
              filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
          )
          .subscribe((result: EventMessage) => {
              const payload = result.payload as AuthenticationResult;
              this.msalAuthService.instance.setActiveAccount(payload.account);
          });

      this.msalBroadcastService.inProgress$
          .pipe(
              filter((status: InteractionStatus) => status === InteractionStatus.None)
          )
          .subscribe(() => {
              this.setLoginDisplay();
          })
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalAuthService.instance.getAllAccounts().length > 0;
  }

  logout(): void {
    this.msalAuthService.logoutRedirect();
  }

  login(): void {
    const signUpSignInFlowRequest: RedirectRequest | PopupRequest = {
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      prompt: PromptValue.LOGIN,
      scopes: []
    };

    this.msalAuthService.loginRedirect(signUpSignInFlowRequest);
  }

}

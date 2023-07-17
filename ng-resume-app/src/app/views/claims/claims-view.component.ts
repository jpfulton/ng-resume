/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { EventType } from "@azure/msal-browser";
import { MsalService, MsalBroadcastService } from "@azure/msal-angular";
import { EventMessage, InteractionStatus } from "@azure/msal-browser";
import { AuthenticationResult } from "@azure/msal-common";
import { filter } from "rxjs";
import { Claim } from "src/app/core/models/claim";
import { createClaimsTable } from "src/app/core/utils/claim-utils";

@Component({
  selector: "app-claims-view",
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: "./claims-view.component.html",
  styleUrls: ["./claims-view.component.scss"],
})
export class ClaimsViewComponent implements OnInit {
  loginDisplay = false;
  displayedColumns: string[] = ["name", "humanValue", "description"];
  dataSource: Claim[] = [];

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS,
        ),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None,
        ),
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.getClaims(
          this.authService.instance.getActiveAccount()?.idTokenClaims,
        );
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getClaims(claims: any) {
    if (claims) {
      const claimsTable = createClaimsTable(claims);
      this.dataSource = [...claimsTable];
    }
  }
}

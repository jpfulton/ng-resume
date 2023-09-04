import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { UsersService } from "./services/users.service";
import { Group, User } from "@jpfulton/ng-resume-api-browser-sdk/types/api";
import { Subscription } from "rxjs";
import { MatTableModule } from "@angular/material/table";
import { PlatformService } from "src/app/core/services/platform.service";
import { MatIconModule } from "@angular/material/icon";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: "app-users-view",
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: "./users-view.component.html",
  styleUrls: ["./users-view.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"),
      ),
    ]),
  ],
})
export class UsersViewComponent implements OnInit, OnDestroy {
  userList: User[] = [];
  expandedUser: User | null = null;
  expandedUserGroups: Group[] = [];
  displayedColumns: string[] = [
    "id",
    "displayName",
    "givenName",
    "surname",
    "federatedIssuer",
  ];
  columnsToDisplayWithExpand: string[] = [...this.displayedColumns, "expand"];

  private usersSubscription: Subscription | null = null;
  private userGroupSubscription: Subscription | null = null;

  constructor(
    private usersService: UsersService,
    private platformService: PlatformService,
  ) {}

  ngOnInit(): void {
    if (this.platformService.isBrowser()) {
      this.usersSubscription = this.usersService
        .getAll()
        .subscribe((data) => (this.userList = data));
    }
  }

  ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
    this.userGroupSubscription?.unsubscribe();
  }

  copyToClipboard(data: string): void {
    navigator.clipboard.writeText(data);
  }

  expandUserRow(user: User): void {
    this.expandedUser = this.expandedUser === user ? null : user;
    this.expandedUserGroups = [];

    if (this.userGroupSubscription) this.userGroupSubscription.unsubscribe();

    this.userGroupSubscription = this.usersService
      .getUserGroupMembership(user.id!)
      .subscribe((data) => (this.expandedUserGroups = data));
  }
}

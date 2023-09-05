import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { UsersService } from "./services/users.service";
import { Group, User } from "@jpfulton/ng-resume-api-browser-sdk/types/api";
import { Subscription } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
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
import {
  MatChipSelectionChange,
  MatChipsModule,
} from "@angular/material/chips";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { IdWidgetComponent } from "./components/id-widget/id-widget.component";
import { MatSort, MatSortModule } from "@angular/material/sort";

@Component({
  selector: "app-users-view",
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
    IdWidgetComponent
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
export class UsersViewComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  
  groupList: Group[] = [];
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

  dataSource = new MatTableDataSource<User>([]);

  private groupSubscription: Subscription | null = null;
  private usersSubscription: Subscription | null = null;
  private userGroupSubscription: Subscription | null = null;

  constructor(
    private usersService: UsersService,
    private platformService: PlatformService,
    private snackBar: MatSnackBar,
  ) { }
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    if (this.platformService.isBrowser()) {
      this.groupSubscription = this.usersService
        .getAllGroups()
        .subscribe((data) => (this.groupList = data));

      this.usersSubscription = this.usersService
        .getAll()
        .subscribe((data) => (this.dataSource.data = data));
    }
  }

  ngOnDestroy(): void {
    this.groupSubscription?.unsubscribe();
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

  async onChipSelectionChange(
    event: MatChipSelectionChange,
    user: User,
    group: Group,
  ): Promise<void> {
    if (event.isUserInput) {
      if (event.selected) {
        await this.usersService.addUserToGroup(group.id!, user);
        this.snackBar.open(
          `User (${user.id}) has been added to the ${group.displayName} group.`,
          undefined,
          {
            duration: 3000,
          },
        );
      } else {
        await this.usersService.removeUserFromGroup(group.id!, user.id!);
        this.snackBar.open(
          `User (${user.id}) has been removed from the ${group.displayName} group.`,
          undefined,
          {
            duration: 3000,
          },
        );
      }
    }

    return new Promise<void>((resolve) => resolve());
  }

  isGroupInExpandedUserGroups(groupId: string): boolean {
    return this.expandedUserGroups.filter((g) => g.id === groupId).length > 0
      ? true
      : false;
  }
}

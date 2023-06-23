import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './services/users.service';
import { User } from '@jpfulton/ng-resume-api-browser-sdk/api';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss']
})
export class UsersViewComponent implements OnInit, OnDestroy {
  userList: User[] = [];
  displayedColumns: string[] = ["id", "displayName", "mail"];

  private usersSubscription: Subscription | null = null;

  constructor(
    private usersService : UsersService
  )
  {
  }

  ngOnInit(): void {
    this.usersSubscription = this.usersService.getAll().subscribe(data => this.userList = data);
  }

  ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }

}

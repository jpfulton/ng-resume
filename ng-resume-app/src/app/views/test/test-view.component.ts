import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { TestService } from './services/test.service';
import { Test } from '@jpfulton/ng-resume-api-browser-sdk/api/types';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-test-view',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.scss']
})
export class TestViewComponent implements OnInit {

  test: Test | undefined;
  accessToken: string | undefined;

  constructor(
    private testService: TestService,
    private authService: AuthService
  )
  { }

  ngOnInit(): void {
    this.authService.getActiveAccessToken().then((result) => this.accessToken = result);
  }

  sendTestPost(): void {
    const test: Test = {
      message: "An example message."
    };

    this.testService.add(test).subscribe(test => this.test = test);
  }

  getTestAsJson(): string {
    return JSON.stringify(this.test, null, 4);
  }
}

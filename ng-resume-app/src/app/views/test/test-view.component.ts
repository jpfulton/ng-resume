import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { TestService } from './services/test.service';
import { Test } from '@jpfulton/ng-resume-api-browser-sdk/api/types';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

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
export class TestViewComponent {

  test: Test | undefined;

  constructor(
    private testService: TestService
  )
  { }

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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService } from './services/test.service';
import { Test } from '@jpfulton/ng-resume-api-browser-sdk/api/types';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-test-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
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
}

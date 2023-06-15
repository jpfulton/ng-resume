import { Injectable } from '@angular/core';
import { NgResumeApiClient } from '@jpfulton/ng-resume-api-browser-sdk';
import { Test } from '@jpfulton/ng-resume-api-browser-sdk/api';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { apiPromiseToObservable } from 'src/app/core/utils/api-helpers';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService
  )
  { 
  }

  add(test: Test): Observable<Test> {
    const apiClient = this.getApiClient();
    return apiPromiseToObservable<Test>(() => apiClient.test.add(test), this.loadingService);
  }

  private getApiClient(): NgResumeApiClient {
    if (!this.authService.isLoggedIn) {
      throw new Error("Cannot initialize api client. No logged in user.");
    }

    return new NgResumeApiClient({
      token: () => this.authService.getActiveAccessToken()
    });
  }
}

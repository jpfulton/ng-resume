import { Injectable } from '@angular/core';
import { Test } from '@jpfulton/ng-resume-api-browser-sdk/api';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { apiPromiseToObservable, getAuthenticatedApiClient } from 'src/app/core/utils/api-helpers';

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
    const apiClient = getAuthenticatedApiClient(this.authService);
    return apiPromiseToObservable<Test>(() => apiClient.test.add(test), this.loadingService);
  }
}

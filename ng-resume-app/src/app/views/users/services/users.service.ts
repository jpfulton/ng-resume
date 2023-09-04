import { Injectable } from "@angular/core";
import { Group, User } from "@jpfulton/ng-resume-api-browser-sdk/types/api";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import { ErrorDialogService } from "src/app/core/services/error-dialog.service";
import { LoadingService } from "src/app/core/services/loading.service";
import {
  apiPromiseToObservableWithRetry,
  getAuthenticatedApiClient,
} from "src/app/core/utils/api-helpers";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(
    private errorDialogService: ErrorDialogService,
    private loadingService: LoadingService,
    private authService: AuthService,
  ) {}

  getAll(): Observable<User[]> {
    const apiClient = getAuthenticatedApiClient(this.authService);

    return apiPromiseToObservableWithRetry<User[]>(
      () => apiClient.users.getAll(),
      this.loadingService,
      this.errorDialogService,
    );
  }

  getUserGroupMembership(userId: string): Observable<Group[]> {
    const apiClient = getAuthenticatedApiClient(this.authService);

    return apiPromiseToObservableWithRetry<Group[]>(
      () => apiClient.users.getUserGroupMembership(userId),
      this.loadingService,
      this.errorDialogService,
    );
  }

  getAllGroups(): Observable<Group[]> {
    const apiClient = getAuthenticatedApiClient(this.authService);

    return apiPromiseToObservableWithRetry<Group[]>(
      () => apiClient.groups.getAll(),
      this.loadingService,
      this.errorDialogService,
    );
  }
}

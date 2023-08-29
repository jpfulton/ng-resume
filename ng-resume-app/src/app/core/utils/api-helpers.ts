/* eslint-disable jsdoc/require-jsdoc */
import {
  NgResumeApiClient,
  NgResumeApiTimeoutError,
  NgResumeApi
} from "@jpfulton/ng-resume-api-browser-sdk";
import {
  Observable,
  catchError,
  defer,
  finalize,
  of,
  retry,
  throwError,
  timer,
} from "rxjs";
import { LoadingService } from "src/app/core/services/loading.service";
import { AuthService } from "../services/auth.service";
import { ErrorDialogService } from "../services/error-dialog.service";

const RETRY_COUNT = 3;
const BACK_OFF_IN_MS = 1000;

/**
 * Helper to convert a Promise to an Observable. Includes retry logic and
 * logic to optionally interact with the LoadingService to interact with the
 * spinner component. Designed to work with Promises returned by the browser
 * SDK package.
 * @template T Data type of the Promise and returned Observable.
 * @param {Function<T>} promiseFactory Factory function that returns a Promise of type T.
 * @param {LoadingService} loadingService Instance of the loading service.
 * @param {ErrorDialogService} errorDialogService Instance of the dialog service.
 * @returns {Observable<T>} An observable created from the Promise.
 */
export function apiPromiseToObservableWithRetry<T>(
  promiseFactory: () => Promise<T>,
  loadingService: LoadingService | null = null,
  errorDialogService: ErrorDialogService | null = null,
): Observable<T> {
  if (loadingService) {
    loadingService.incrementTotalRequests();
  }

  // usage of the "defer" operator postpones execution of the promise until subscribe is
  // called on the Observable
  return defer(promiseFactory).pipe(
    retry({
      count: RETRY_COUNT,
      delay: (error, retryCount) => {
        if (error instanceof NgResumeApiTimeoutError)
          return timer(retryCount * BACK_OFF_IN_MS);
        else return throwError(() => error);
      },
    }),
    catchError((error) => {
      if (error instanceof NgResumeApiTimeoutError) {
        if (errorDialogService) {
          errorDialogService.openTimeoutDialog();
          return of();
        }
      } else if (error instanceof NgResumeApi.UnauthorizedError) {
        if (errorDialogService) {
          errorDialogService.openUnauthorizedDialog();
          return of();
        }
      }

      return throwError(() => error);
    }),
    finalize(() => {
      if (loadingService) {
        loadingService.decrementTotalRequests();
      }
    }),
  );
}

/**
 * Helper to convert a Promise to an Observable. Includes
 * logic to optionally interact with the LoadingService to interact with the
 * spinner component. Designed to work with Promises returned by the browser
 * SDK package.
 * @template T Data type of the Promise and returned Observable.
 * @param {Function<T>} promiseFactory Factory function that returns a Promise of type T.
 * @param {LoadingService} loadingService Instance of the loading service.
 * @param {ErrorDialogService} errorDialogService Instance of the dialog service.
 * @returns {Observable<T>} An observable created from the Promise.
 */
export function apiPromiseToObservable<T>(
  promiseFactory: () => Promise<T>,
  loadingService: LoadingService | null = null,
  errorDialogService: ErrorDialogService | null = null,
): Observable<T> {
  if (loadingService) {
    loadingService.incrementTotalRequests();
  }

  // usage of the "defer" operator postpones execution of the promise until subscribe is
  // called on the Observable
  return defer(promiseFactory).pipe(
    catchError((error) => {
      if (error instanceof NgResumeApiTimeoutError) {
        if (errorDialogService) {
          errorDialogService.openTimeoutDialog();
          return of();
        }
      }

      return throwError(() => error);
    }),
    finalize(() => {
      if (loadingService) {
        loadingService.decrementTotalRequests();
      }
    }),
  );
}

/**
 * Constructs and returns an api client suitable for access to
 * unauthenticated api endpoints.
 * @returns {NgResumeApiClient} An api client.
 */
export function getAnonymousApiClient(): NgResumeApiClient {
  return new NgResumeApiClient({});
}

/**
 * Constructs and returns an api client suitable for access to
 * authenticated api endpoints.
 * @param {AuthService} authService Instance of the authentication service.
 * @returns {NgResumeApiClient} An api client.
 */
export function getAuthenticatedApiClient(authService: AuthService) {
  if (!authService.isLoggedIn) {
    throw new Error(
      "Cannot initialize authenticated api client. No logged in user.",
    );
  }

  return new NgResumeApiClient({
    token: () => authService.getActiveAccessToken(),
  });
}

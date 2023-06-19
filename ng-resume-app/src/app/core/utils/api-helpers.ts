/* eslint-disable jsdoc/require-jsdoc */
import { NgResumeApiClient } from '@jpfulton/ng-resume-api-browser-sdk';
import { APIResponse, Fetcher, fetcher } from '@jpfulton/ng-resume-api-browser-sdk/core';
import { Observable, defer, finalize, retry, timer } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { AuthService } from '../services/auth.service';

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
 * @returns {Observable<T>} An observable created from the Promise.
 */
export function apiPromiseToObservableWithRetry<T>(
    promiseFactory: () => Promise<T>,
    loadingService: LoadingService | null = null): Observable<T> {
    if (loadingService) {
        loadingService.incrementTotalRequests();
    }

    // usage of the "defer" operator postpones execution of the promise until subscribe is
    // called on the Observable
    return defer(promiseFactory).pipe(
        retry({
            count: RETRY_COUNT,
            delay: (_error, retryCount) => timer(retryCount * BACK_OFF_IN_MS)
        }),
        finalize(() => {
            if (loadingService) {
                loadingService.decrementTotalRequests();
            }
        })
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
 * @returns {Observable<T>} An observable created from the Promise.
 */
export function apiPromiseToObservable<T>(
    promiseFactory: () => Promise<T>,
    loadingService: LoadingService | null = null): Observable<T> {
    if (loadingService) {
        loadingService.incrementTotalRequests();
    }

    // usage of the "defer" operator postpones execution of the promise until subscribe is
    // called on the Observable
    return defer(promiseFactory).pipe(
        finalize(() => {
            if (loadingService) {
                loadingService.decrementTotalRequests();
            }
        })
      );
}

export async function customFetcher<R = unknown>(args: Fetcher.Args): Promise<APIResponse<R, Fetcher.Error>> {
    const headers: Record<string, string | undefined> | undefined = args.headers;
    if (headers) {
        const authorizeHeaderValue = headers["Authorization"];
        delete headers["Authorization"];

        headers["X-Function-Api-Authorization"] = authorizeHeaderValue;
    }

    args.headers = headers;
    
    return fetcher(args);
}

export function getAnonymousApiClient(): NgResumeApiClient {
    return new NgResumeApiClient({});
}

export function getAuthenticatedApiClient(authService: AuthService) {
    if (!authService.isLoggedIn) {
        throw new Error("Cannot initialize api client. No logged in user.");
    }

    return new NgResumeApiClient({
        token: () => authService.getActiveAccessToken(),
        fetcher: customFetcher
    });
}

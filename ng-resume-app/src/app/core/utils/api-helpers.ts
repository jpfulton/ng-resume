import { Observable, defer, finalize, retry, timer } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';

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

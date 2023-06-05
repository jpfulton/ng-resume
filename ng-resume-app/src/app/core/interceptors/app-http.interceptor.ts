/* eslint-disable jsdoc/require-jsdoc */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize, retry, timer } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Interceptor for HTTP requests made by the HttpClient service.
 * Provides retry logic on API GET requests, manages the loading component
 * through a service and currenly allows errors to be passed to the global
 * error handler.
 */
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(
    private loadingService: LoadingService
  ) 
  {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    this.loadingService.setLoading(true);

    if (request.method === "GET") {
      return next.handle(request).pipe(
        retry({ count: 3, delay: (_error, retryCount) => timer(retryCount * 1000) }),
        finalize(() => this.manageTotalRequests() )
      );
    }
    else {
      return next.handle(request).pipe(
        finalize(() => this.manageTotalRequests() )
      );
    }
  }

  private manageTotalRequests() {
    this.totalRequests--;

    if (this.totalRequests == 0) {
      this.loadingService.setLoading(false);
    }
  }
}

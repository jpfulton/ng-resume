import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = false;
  private totalRequests = 0;

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  getLoading(): boolean {
    return this.loading;
  }

  incrementTotalRequests() {
    this.totalRequests++;

    if (this.totalRequests > 0) {
      this.loading = true;
    }
  }

  decrementTotalRequests() {
    this.totalRequests--;

    if (this.totalRequests === 0) {
      this.loading = false;
    }
  }
}

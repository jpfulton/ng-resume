import { Injectable, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { GOOGLE_COOKIE_PREFIX, GOOGLE_TRACKING_IDS } from '../constants/google-constants';

import { CookieService } from 'ngx-cookie-service';

/**
 * 
 * References:
 *  https://developers.google.com/tag-platform/gtagjs/reference
 *  https://developers.google.com/tag-platform/devguides/consent
 *  https://developers.google.com/analytics/devguides/collection/gtagjs
 *  https://developers.google.com/analytics/devguides/collection/gtagjs/events
 *  https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 */
@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  private isInitialized = false;

  constructor(
    private cookieService: CookieService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
  ) 
  {
  }

  /**
   * 
   */
  initializeAndCreateCookies() : void {
    if (!this.isInitialized) {
      gtag("js", new Date());
      gtag("consent", "default", { "ad_storage": "granted", "analytics_storage": "granted" });
    }
    else
      // issue an update here, if the service was previously initialized and the user regranted consent
      gtag("consent", "update", { "ad_storage": "granted", "analytics_storage": "granted" });

    GOOGLE_TRACKING_IDS.forEach(trackingId => {
      gtag("config", trackingId);
    });

    this.isInitialized = true;
  }

  /**
   * 
   */
  destroyAndClearCookies() : void {
    gtag("consent", "update", { "ad_storage": "denied", "analytics_storage": "denied" });

    this.cookieService.delete(this.getMainCookieName());

    GOOGLE_TRACKING_IDS.forEach(trackingId => {
      this.cookieService.delete(this.getPropertyCookieName(trackingId));
    });
  }

  private getMainCookieName() : string {
    return GOOGLE_COOKIE_PREFIX;
  }

  private getPropertyCookieName(trackingId: string) : string {
    return GOOGLE_COOKIE_PREFIX + "_" + trackingId.substring(2);
  }

  sendPageView(urlAfterRedirects: string) : void {
    if (!this.isInitialized) return;

    const title = this.titleService.getTitle();

    gtag('event', 'page_view', {
      page_title: title,
      page_path: urlAfterRedirects,
      page_location: this.document.location.href
    });
  }
}

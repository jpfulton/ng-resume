import { Injectable, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { GOOGLE_COOKIE_PREFIX, GOOGLE_TRACKING_IDS } from '../constants/google-constants';

import { CookieService } from 'ngx-cookie-service';

/**
 * Service to encapsulate Google Analytics logic. Manages gtag related calls
 * and cookie management.
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
   * Initialize the gtag system for Google Analytics and set associate cookies. Consent
   * properties are also set here. If the service is starting up for the first time, a default
   * consent policy is set. If the user has toggled cookie and analytics consent in the UI,
   * a consent policy update is issued.
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
   * Update the Goodle Analytics consent policy to deny tracking and storage. Delete
   * associated cookies.
   */
  destroyAndClearCookies() : void {
    gtag("consent", "update", { "ad_storage": "denied", "analytics_storage": "denied" });

    this.cookieService.delete(this.getMainCookieName());

    GOOGLE_TRACKING_IDS.forEach(trackingId => {
      this.cookieService.delete(this.getPropertyCookieName(trackingId));
    });
  }

  /**
   * Get the "main" ga cookie name.
   * @returns {string} Name of the "main" ga cookie.
   */
  private getMainCookieName() : string {
    return GOOGLE_COOKIE_PREFIX;
  }

  /**
   * Get the property cookie name.
   * @param {string} trackingId The full GA property tracking id.
   * @returns {string} The cookie name associate with the GA property id.
   */
  private getPropertyCookieName(trackingId: string) : string {
    return GOOGLE_COOKIE_PREFIX + "_" + trackingId.substring(2);
  }

  /**
   * Send a page view event to GA.
   * @param {string} urlAfterRedirects The final url from the Router object following navigation.
   */
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

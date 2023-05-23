import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { NgcCookieConsentService } from 'ngx-cookieconsent';

/**
 * Root component for ng-resume application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    private router: Router,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    private cookieConsentService: NgcCookieConsentService
    ) 
  {
    this.handleRouteEvents();
  }

  /**
   * Subscribes to events triggered by the router. On NavigationEnd events, which are
   * sent at the end of a successful router navgation, push a page_view event to 
   * Google Analytics.
   * 
   * References:
   *  https://developers.google.com/analytics/devguides/collection/gtagjs/events
   *  https://developers.google.com/analytics/devguides/collection/gtagjs/pages
   */
  handleRouteEvents() : void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.titleService.getTitle();

        gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects,
          page_location: this.document.location.href
        })
      }
    });
  }

}

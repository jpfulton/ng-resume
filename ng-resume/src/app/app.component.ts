import { Subscription } from 'rxjs';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { GoogleAnalyticsService } from './core/services/google-analytics.service';

/**
 * Root component for ng-resume application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private routerEventsSubscription: Subscription | undefined;
  private cookieConsentStatusChangeSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private cookieConsentService: NgcCookieConsentService,
    private googleAnalyticsService: GoogleAnalyticsService
    ) 
  {
  }

  ngOnInit(): void {
    this.handleConsentStatusEvents();
    this.handleRouteEvents();
  }

  /**
   * Unsubscribe to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.routerEventsSubscription?.unsubscribe();
    this.cookieConsentStatusChangeSubscription?.unsubscribe();
  }

  /**
   * 
   */
  private handleConsentStatusEvents() : void {
    this.cookieConsentStatusChangeSubscription = this.cookieConsentService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        if (event.status === "allow")
          this.googleAnalyticsService.initializeAndCreateCookies();
        else if (event.status === "deny")
          this.googleAnalyticsService.destroyAndClearCookies();
      }
    );
  }

  /**
   * Subscribes to events triggered by the router. On NavigationEnd events, which are
   * sent at the end of a successful router navgation, push a page_view event to 
   * Google Analytics.
   */
  private handleRouteEvents() : void {
    this.routerEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.googleAnalyticsService.sendPageView(event.urlAfterRedirects);
      }
    });
  }

}

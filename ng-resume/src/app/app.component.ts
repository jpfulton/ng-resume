import { Subscription } from 'rxjs';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivationEnd, Data, NavigationEnd, Router } from '@angular/router';

import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';

import { GoogleAnalyticsService } from './core/services/google-analytics.service';
import { SeoService } from './core/services/seo.service';
import { GlobalErrorHandler } from './core/utils/global-error-handler';
import { ApplicationInsightsService } from './core/services/application-insights.service';
import { LoggingService } from './core/services/logging.service';

/**
 * Root component for ng-resume application.
 * 
 * References:
 *  https://tinesoft.github.io/ngx-cookieconsent/doc/index.html
 *  https://tinesoft.github.io/ngx-cookieconsent/home
 *  https://github.com/tinesoft/ngx-cookieconsent
 *  
 *  https://github.com/microsoft/ApplicationInsights-JS
 *  https://github.com/microsoft/applicationinsights-angularplugin-js
 *  https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-framework-extensions?tabs=angular
 *  https://github.com/MicrosoftDocs/azure-docs/issues/109392
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
    private globalErrorHandler: GlobalErrorHandler,
    private applicationInsightsService: ApplicationInsightsService,
    private cookieConsentService: NgcCookieConsentService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private seoService: SeoService,
    private loggingService: LoggingService
    ) 
  {
  }

  ngOnInit(): void {
    const currentCookieConsent = this.cookieConsentService.hasConsented();
    this.loggingService.logInfo(`Current cookie consent status: ${currentCookieConsent}.`);

    this.applicationInsightsService.initialize(
      this.router, 
      this.globalErrorHandler,
      currentCookieConsent);

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
   * Handle cookie consent status change events.
   */
  private handleConsentStatusEvents() : void {
    this.cookieConsentStatusChangeSubscription = this.cookieConsentService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        const consentStatus = event.status;
        this.loggingService.logInfo(`Cookie consent status changed to ${consentStatus}.`);

        if (consentStatus === "allow") {
          this.googleAnalyticsService.initializeAndCreateCookies();
          this.applicationInsightsService.enableCookies(true);
        }
        else if (consentStatus === "deny") {
          this.googleAnalyticsService.destroyAndClearCookies();
          this.applicationInsightsService.enableCookies(false);
        }
      }
    );
  }

  /**
   * Subscribes to events triggered by the router.
   * On ActivationEnd events, which are sent following the activation phase of routes and
   * allow access to the route's snapshot data property, set head tags and SEO meta data.
   * On NavigationEnd events, which are sent at the end of a successful router navgation, 
   * push a page_view event to Google Analytics.
   * 
   * Route data property example:
   * `data: { image: "/assets/images/harbor.jpg", description: "Site privacy policy.", keywords: ["privacy policy", "Angular", "Angular Universal"], allowRobotIndexing: true }`
   */
  private handleRouteEvents() : void {
    this.routerEventsSubscription = this.router.events.subscribe(event => {

      if (event instanceof ActivationEnd) { // route data snapshots are available at this stage
        const title = event.snapshot.title;
        const routeData : Data = event.snapshot.data;

        const image = routeData["image"];
        const description = routeData["description"];
        const keywords = routeData["keywords"];

        const allowRobotIndexing = routeData["allowRobotIndexing"] ?? false; // route config data must be explicit about allowing robot indexing

        this.seoService.updateSeoHeaderTags(
          {
            title: title,
            image: image,
            description: description,
            keywords: keywords
          },
          allowRobotIndexing
        );
      }
      else if (event instanceof NavigationEnd) {
        this.googleAnalyticsService.sendPageView(event.urlAfterRedirects);
      }
    });
  }

}

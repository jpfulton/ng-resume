/* eslint-disable jsdoc/require-param-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';

import { GlobalErrorHandler } from '../utils/global-error-handler';
import { APPLICATION_INSIGHTS_CONNECTION_STRING, APPLICATION_INSIGHTS_COOKIE_NAMES } from '../constants/application-insights-constants';

/**
 * Encapsulates Azure Application Insights integration with initialization logic
 * and utility methods. Note that passing router and globalErrorHandler parameters
 * to methods that require them helps avoid a circular dependency problem in the
 * DI engine related to the GlobalErrorHandler class.
 * 
 * References:
 *  https://github.com/microsoft/applicationinsights-angularplugin-js
 *  https://github.com/microsoft/ApplicationInsights-JS
 *  https://devblogs.microsoft.com/premier-developer/angular-how-to-add-application-insights-to-an-angular-spa/
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationInsightsService {
  private isInitialized = false;
  private currentCookieSetting = false;

  private appInsights: ApplicationInsights | null = null;

  constructor(private cookieService: CookieService) {}

  /**
   * Utility method to check for initialization of this service
   * and throw an error if the service is not ready.
   * @param {string} method Name of invoking method.
   */
  private checkIsInitialized(method: string) {
    if (!this.isInitialized || this.appInsights === null)
      throw new Error(`Application insights is not initialized. Cannot invoke ${method}.`);
  }

  /**
   * Performs internal initialization of the Application Insights script 
   * and Angular plugin.
   * @param {Router} router Router object.
   * @param {GlobalErrorHandler} globalErrorHandler Custom error handler object.
   * @param {boolean} allowCookies Setting to allow use of cookies.
   */
  private createApplicationInsights(
    router: Router, 
    globalErrorHandler: GlobalErrorHandler,
    allowCookies: boolean) : void 
  {
    if (this.isInitialized) {
      this.appInsights?.flush();
      this.appInsights?.unload();
    }

    const angularPlugin = new AngularPlugin();

    this.appInsights = new ApplicationInsights(
      { config: {
          connectionString: APPLICATION_INSIGHTS_CONNECTION_STRING,
          disableCookiesUsage: !allowCookies,
          extensions: [angularPlugin],
          extensionConfig: {
            [angularPlugin.identifier]: { 
              router: router,
              errorServices: [globalErrorHandler]
            }
          }
        } 
      }
    );

    this.appInsights.loadAppInsights();
  }

  /**
   * Initializes this service.
   * @param {Router} router Router object.
   * @param {GlobalErrorHandler} globalErrorHandler Custom error handler object.
   * @param {boolean} allowCookies Setting to allow use of cookies. Defaults to false.
   */
  initialize(
    router: Router, 
    globalErrorHandler: GlobalErrorHandler,
    allowCookies = false
    ) : void 
  {
    if (this.isInitialized) {
      throw new Error("Repeat initialization of ApplicationInsightsService attempted.");
    }

    this.currentCookieSetting = allowCookies;

    this.createApplicationInsights(router, globalErrorHandler, allowCookies);
    this.appInsights?.trackPageView();

    this.isInitialized = true;
  }

  /**
   * Sets the cookie policy for Application Insights.
   * @param {Router} router Router object.
   * @param {GlobalErrorHandler} globalErrorHandler Custom error handler object.
   * @param {boolean} value Setting to allow use of cookies.
   */
  enableCookies(
    router: Router, 
    globalErrorHandler: GlobalErrorHandler,
    value: boolean) : void 
  {
    this.checkIsInitialized("enableCookies");

    // Note that the follwing line works in version ^3.0.0 but not in ^2.8.12 (version in use here)
    // of @microsoft/applicationinsights-web
    // this.appInsights?.getCookieMgr().setEnabled(value);

    if (value === this.currentCookieSetting) return; // do nothing

    // peform an internal reinitialization with new cookie setting
    this.createApplicationInsights(router, globalErrorHandler, value);

    // delete the ai cookies if they exist
    if (value === false) {
      APPLICATION_INSIGHTS_COOKIE_NAMES.forEach(element => {
        this.cookieService.delete(element);
      });
    }
  }

  /**
   * Manually logs a page view event.
   * @param {string} name Page title.
   * @param {string} url Url of page.
   */
  logPageView(name?: string, url?: string) { // option to call manually
    this.checkIsInitialized("logPageView");

    this.appInsights?.trackPageView({
      name: name,
      uri: url
    });
  }

  /**
   * Logs a custom event.
   * @param {string} name Name of the custom event.
   * @param properties Event properties object.
   */
  logEvent(name: string, properties?: { [key: string]: any }) {
    this.checkIsInitialized("logEvent");
    this.appInsights?.trackEvent({ name: name}, properties);
  }

  /**
   * Logs a metric.
   * @param {string} name Metric name.
   * @param {number} average Metric average.
   * @param properties Metric properties object.
   */
  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    this.checkIsInitialized("logMetric");
    this.appInsights?.trackMetric({ name: name, average: average }, properties);
  }

  /**
   * Logs an exception.
   * @param {Error} exception Exception error object.
   * @param {number} severityLevel Severity level.
   */
  logException(exception: Error, severityLevel?: number) {
    this.checkIsInitialized("logException");
    this.appInsights?.trackException({ exception: exception, severityLevel: severityLevel });
  }

  /**
   * Logs a trace.
   * @param {string} message Trace message.
   * @param properties Trace properties object.
   */
  logTrace(message: string, properties?: { [key: string]: any }) {
    this.checkIsInitialized("logTrace");
    this.appInsights?.trackTrace({ message: message}, properties);
  }
}

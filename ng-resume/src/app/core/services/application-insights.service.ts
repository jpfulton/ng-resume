/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';

import { GlobalErrorHandler } from '../utils/global-error-handler';
import { APPLICATION_INSIGHTS_CONNECTION_STRING } from '../constants/application-insights-constants';

/**
 * Encapsulates Azure Application Insights integration with initialization logic
 * and utility methods.
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
  private appInsights: ApplicationInsights | null = null;

  private checkIsInitialized(method: string) {
    if (!this.isInitialized || this.appInsights === null)
      throw new Error(`Application insights is not initialized. Cannot invoke ${method}.`);
  }

  initialize(
    router: Router, 
    globalErrorHandler: GlobalErrorHandler,
    allowCookies = false
    ) : void 
  {
    if (this.isInitialized) 
      throw new Error("Repeat initialization of ApplicationInsightsService attempted.");

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
    this.isInitialized = true;
  }

  enableCookies(value: boolean) : void {
    this.checkIsInitialized("enableCookies");
    this.appInsights?.getCookieMgr().setEnabled(value);
  }

  logPageView(name?: string, url?: string) { // option to call manually
    this.checkIsInitialized("logPageView");

    this.appInsights?.trackPageView({
      name: name,
      uri: url
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.checkIsInitialized("logEvent");
    this.appInsights?.trackEvent({ name: name}, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    this.checkIsInitialized("logMetric");
    this.appInsights?.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    this.checkIsInitialized("logException");
    this.appInsights?.trackException({ exception: exception, severityLevel: severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    this.checkIsInitialized("logTrace");
    this.appInsights?.trackTrace({ message: message}, properties);
  }
}

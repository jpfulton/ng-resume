/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalErrorHandler } from '../utils/global-error-handler';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
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

  initialize(router: Router, globalErrorHandler: GlobalErrorHandler) : void {
    if (this.isInitialized) return;

    const angularPlugin = new AngularPlugin();

    this.appInsights = new ApplicationInsights(
      { config: {
          connectionString: APPLICATION_INSIGHTS_CONNECTION_STRING,
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

  logPageView(name?: string, url?: string) { // option to call manually
    if (!this.isInitialized) return;

    this.appInsights?.trackPageView({
      name: name,
      uri: url
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    if (!this.isInitialized) return;
    this.appInsights?.trackEvent({ name: name}, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    if (!this.isInitialized) return;
    this.appInsights?.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    if (!this.isInitialized) return;
    this.appInsights?.trackException({ exception: exception, severityLevel: severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    if (!this.isInitialized) return;
    this.appInsights?.trackTrace({ message: message}, properties);
  }
}

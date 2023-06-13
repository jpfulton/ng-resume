/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Subject, Subscription, catchError, delay, filter, of, takeUntil, throwError } from 'rxjs';

import {
  Component,
  OnInit,
  OnDestroy,
  ApplicationRef,
  NgZone,
  HostBinding,
  ViewChild,
  AfterViewInit,
  Inject
} from '@angular/core';
import { ActivationEnd, Data, EventType, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { OverlayContainer } from '@angular/cdk/overlay';

import { NgcCookieConsentService, NgcStatusChangeEvent } from 'ngx-cookieconsent';

import { GoogleAnalyticsService } from './core/services/google-analytics.service';
import { SeoService } from './core/services/seo.service';
import { GlobalErrorHandler } from './core/utils/global-error-handler';
import { ApplicationInsightsService } from './core/services/application-insights.service';
import { LoggingService } from './core/services/logging.service';
import { SpinnerComponent } from './core/components/spinner/spinner.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { HeaderComponent } from './core/components/header/header.component';
import { PlatformService } from './core/services/platform.service';
import { ThemeService } from './core/services/theme.service';
import { MsalService, MsalBroadcastService, MsalGuardConfiguration, MSAL_GUARD_CONFIG, MsalRedirectComponent } from '@azure/msal-angular';
import { EventMessage, InteractionStatus, AuthenticationResult, AccountInfo, SsoSilentRequest, RedirectRequest, PopupRequest, InteractionType } from '@azure/msal-browser';
import { EventType as MsalEventType } from '@azure/msal-browser';
import { b2cPolicies } from './core/constants/auth-constants';
import { IdTokenClaims, PromptValue } from '@azure/msal-common';

type IdTokenClaimsWithPolicyId = IdTokenClaims & {
  acr?: string,
  tfp?: string,
};

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
    standalone: true,
    imports: [
        HeaderComponent,
        RouterOutlet,
        FooterComponent,
        SpinnerComponent,
    ],
})
export class AppComponent extends MsalRedirectComponent implements AfterViewInit, OnInit, OnDestroy {
  @HostBinding("class") classAttribute = "mat-app-background";
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  isIframe = false;
  loginDisplay = false;

  private readonly _destroying$ = new Subject<void>();

  private stabilityStatus = false;

  private routerEventsSubscription: Subscription | undefined;
  private cookieConsentStatusChangeSubscription: Subscription | undefined;
  private themeSubscription: Subscription | undefined;
  private stabilitySubscription: Subscription | undefined;
  private toggleSubscription: Subscription | undefined;

  constructor(
    private app: ApplicationRef,
    private zone: NgZone,
    private router: Router,
    private overlay: OverlayContainer,
    private globalErrorHandler: GlobalErrorHandler,
    private applicationInsightsService: ApplicationInsightsService,
    private cookieConsentService: NgcCookieConsentService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private seoService: SeoService,
    private loggingService: LoggingService,
    private platformService: PlatformService,
    private themeService: ThemeService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService 
  ) 
  {
    super(msalAuthService);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.handleRouteEvents(); // needed for both SSR and SPA

    if (this.platformService.isBrowser()) { // statements below don't work in SSR, not needed there
      
      this.stabilitySubscription = this.app.isStable.subscribe((isStable) => {
        if (isStable && !this.stabilityStatus) {
          this.loggingService.logDebug("Application has emitted isStable: " + isStable);
          this.stabilityStatus = isStable;
        }
      });

      const currentCookieConsent = this.cookieConsentService.hasConsented();
      this.loggingService.logInfo(`Current cookie consent status: ${currentCookieConsent}.`);

      this.zone.runOutsideAngular(() => { // this is long running and can prevent an emit of the isStable = true event
        this.handleConsentStatusEvents();
      });

      this.zone.runOutsideAngular(() => { // this is long running and can prevent an emit of the isStable = true event
        this.applicationInsightsService.initialize(
          this.router, 
          this.globalErrorHandler,
          currentCookieConsent);
        
        this.loggingService.logDebug("Application insights service initialization complete.");
      });

      const window = this.platformService.getWindow();
      if (window) {
        this.isIframe = window !== window.parent && !window.opener
      }
      this.initAuthAndMsal();
    }
  }

  /**
   * At this point in the lifecycle, variables that are host bound attributes or
   * variables from view children become accessible.
   */
  ngAfterViewInit(): void {
    this.themeSubscription = this.themeService.theme
      .pipe(delay(0)) // Reference: https://blog.angular-university.io/angular-debugging/
      .subscribe((theme: string) => {
        this.loggingService.logInfo("Theme service reports preference of " + theme + " theme.");
        this.applicationInsightsService.logEvent("PlatformThemePreference", { theme: theme });

        const isDarkMode = (theme === this.themeService.DARK_MODE);

        this.headerComponent.darkModeToggle.checked = isDarkMode;
        this.toggleDarkModeClasses(isDarkMode);
    });

    this.toggleSubscription = this.headerComponent.darkModeToggle.change.subscribe((darkMode) => {
      this.toggleDarkModeClasses(darkMode.checked);
      this.applicationInsightsService.logEvent("ToggleDarkMode", { enabled: darkMode.checked });
    });
  }

  private toggleDarkModeClasses(darkMode: boolean) {
    const matAppBackgroundClassName = "mat-app-background";
    const darkClassName = "darkMode";

    this.classAttribute = darkMode ? matAppBackgroundClassName + " " + darkClassName : matAppBackgroundClassName;

    if (darkMode) {
      this.overlay.getContainerElement().classList.add(darkClassName);
    }
    else {
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }
  }

  private initAuthAndMsal(): void {
    this.setLoginDisplay();

    this.msalAuthService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window

    /**
     * You can subscribe to MSAL events as shown below. For more info,
     * visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md
     */
    this.msalBroadcastService.msalSubject$
        .pipe(
            filter((msg: EventMessage) => msg.eventType === MsalEventType.ACCOUNT_ADDED || msg.eventType === MsalEventType.ACCOUNT_REMOVED),
        )
        .subscribe((result: EventMessage) => {
            if (this.msalAuthService.instance.getAllAccounts().length === 0) {
                window.location.pathname = "/";
            } else {
                this.setLoginDisplay();
            }
        });

    this.msalBroadcastService.inProgress$
        .pipe(
            filter((status: InteractionStatus) => status === InteractionStatus.None),
            takeUntil(this._destroying$)
        )
        .subscribe(() => {
            this.setLoginDisplay();
            this.checkAndSetActiveAccount();
        })

    this.msalBroadcastService.msalSubject$
        .pipe(
            filter((msg: EventMessage) => msg.eventType === MsalEventType.LOGIN_SUCCESS
                || msg.eventType === MsalEventType.ACQUIRE_TOKEN_SUCCESS
                || msg.eventType === MsalEventType.SSO_SILENT_SUCCESS),
            takeUntil(this._destroying$)
        )
        .subscribe((result: EventMessage) => {

            const payload = result.payload as AuthenticationResult;
            const idtoken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;

            if (idtoken.acr === b2cPolicies.names.signUpSignIn || idtoken.tfp === b2cPolicies.names.signUpSignIn) {
                this.msalAuthService.instance.setActiveAccount(payload.account);
            }

            /**
             * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
             * from SUSI flow. "acr" claim in the id token tells us the policy (NOTE: newer policies may use the "tfp" claim instead).
             * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
             */
            if (idtoken.acr === b2cPolicies.names.editProfile || idtoken.tfp === b2cPolicies.names.editProfile) {

                // retrieve the account from initial sing-in to the app
                const originalSignInAccount = this.msalAuthService.instance.getAllAccounts()
                    .find((account: AccountInfo) =>
                        account.idTokenClaims?.oid === idtoken.oid
                        && account.idTokenClaims?.sub === idtoken.sub
                        && ((account.idTokenClaims as IdTokenClaimsWithPolicyId).acr === b2cPolicies.names.signUpSignIn
                            || (account.idTokenClaims as IdTokenClaimsWithPolicyId).tfp === b2cPolicies.names.signUpSignIn)
                    );

                const signUpSignInFlowRequest: SsoSilentRequest = {
                    authority: b2cPolicies.authorities.signUpSignIn.authority,
                    account: originalSignInAccount
                };

                // silently login again with the signUpSignIn policy
                this.msalAuthService.ssoSilent(signUpSignInFlowRequest);
            }

            /**
             * Below we are checking if the user is returning from the reset password flow.
             * If so, we will ask the user to reauthenticate with their new password.
             * If you do not want this behavior and prefer your users to stay signed in instead,
             * you can replace the code below with the same pattern used for handling the return from
             * profile edit flow (see above ln. 74-92).
             */
            if (idtoken.acr === b2cPolicies.names.resetPassword || idtoken.tfp === b2cPolicies.names.resetPassword) {
                const signUpSignInFlowRequest: RedirectRequest | PopupRequest = {
                    authority: b2cPolicies.authorities.signUpSignIn.authority,
                    prompt: PromptValue.LOGIN, // force user to reauthenticate with their new password
                    scopes: []
                };

                this.login(signUpSignInFlowRequest);
            }

            return result;
        });

    this.msalBroadcastService.msalSubject$
      .pipe(
          filter((msg: EventMessage) =>
            msg.eventType === MsalEventType.LOGIN_FAILURE ||
            msg.eventType === MsalEventType.ACQUIRE_TOKEN_FAILURE),
          takeUntil(this._destroying$),
        )
        .subscribe((result: EventMessage) => {
            // Checking for the forgot password error. Learn more about B2C error codes at
            // https://learn.microsoft.com/azure/active-directory-b2c/error-codes
            if (result.error && result.error.message.indexOf('AADB2C90118') > -1) {
                const resetPasswordFlowRequest: RedirectRequest | PopupRequest = {
                    authority: b2cPolicies.authorities.resetPassword.authority,
                    scopes: [],
                };

                this.login(resetPasswordFlowRequest);
            }
            else if (result.error && result.error.message.indexOf("AADB2C90091") > -1) {
              this.loggingService.logWarn("User canceled signin process.");
            }
        });
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalAuthService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
      /**
       * If no active account set but there are accounts signed in, sets first account to active account
       * To use active account set here, subscribe to inProgress$ first in your component
       * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
       */
      const activeAccount = this.msalAuthService.instance.getActiveAccount();

      if (!activeAccount && this.msalAuthService.instance.getAllAccounts().length > 0) {
          const accounts = this.msalAuthService.instance.getAllAccounts();
          // add your code for handling multiple accounts here
          this.msalAuthService.instance.setActiveAccount(accounts[0]);
      }
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
      if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
          if (this.msalGuardConfig.authRequest) {
              this.msalAuthService.loginPopup({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as PopupRequest)
                  .subscribe((response: AuthenticationResult) => {
                      this.msalAuthService.instance.setActiveAccount(response.account);
                  });
          } else {
              this.msalAuthService.loginPopup(userFlowRequest)
                  .subscribe((response: AuthenticationResult) => {
                      this.msalAuthService.instance.setActiveAccount(response.account);
                  });
          }
      } else {
          if (this.msalGuardConfig.authRequest) {
              this.msalAuthService.loginRedirect({ ...this.msalGuardConfig.authRequest, ...userFlowRequest } as RedirectRequest);
          } else {
              this.msalAuthService.loginRedirect(userFlowRequest);
          }
      }
  }

  logout() {
      this.msalAuthService.logout();
  }

  /**
   * Unsubscribe to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.routerEventsSubscription?.unsubscribe();
    this.cookieConsentStatusChangeSubscription?.unsubscribe();
    this.themeSubscription?.unsubscribe();
    this.stabilitySubscription?.unsubscribe();
    this.toggleSubscription?.unsubscribe();

    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  /**
   * Handle cookie consent status change events.
   */
  private handleConsentStatusEvents() : void {
    this.cookieConsentStatusChangeSubscription = this.cookieConsentService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        const consentStatus = event.status;

        this.loggingService.logInfo(`Cookie consent status changed to ${consentStatus}.`);
        this.applicationInsightsService.logEvent(
          "CookieConsentStatusChange",
          {
            cookieConsentGiven: consentStatus
          }
        );

        if (consentStatus === "allow") {
          this.googleAnalyticsService.initializeAndCreateCookies();
          this.applicationInsightsService.enableCookies(this.router, this.globalErrorHandler, true);
        }
        else if (consentStatus === "deny") {
          this.googleAnalyticsService.destroyAndClearCookies();
          this.applicationInsightsService.enableCookies(this.router, this.globalErrorHandler, false);
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
  private handleRouteEvents(): void {
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

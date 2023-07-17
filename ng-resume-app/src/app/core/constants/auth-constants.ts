/**
 * This file contains authentication parameters. Contents of this file
 * is roughly the same across other MSAL.js libraries. These parameters
 * are used to initialize Angular and MSAL Angular configurations in
 * in app.module.ts file.
 */

import { inject } from "@angular/core";
import {
  LogLevel,
  Configuration,
  BrowserCacheLocation,
} from "@azure/msal-browser";
import { LoggingService } from "../services/logging.service";

// const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_susi",
    resetPassword: "B2C_1_reset",
    editProfile: "B2C_1_profile",
  },
  authorities: {
    signUpSignIn: {
      authority:
        "https://jpatrickfulton.b2clogin.com/jpatrickfulton.onmicrosoft.com/b2c_1_susi",
    },
    resetPassword: {
      authority:
        "https://jpatrickfulton.b2clogin.com/jpatrickfulton.onmicrosoft.com/B2C_1_reset",
    },
    editProfile: {
      authority:
        "https://jpatrickfulton.b2clogin.com/jpatrickfulton.onmicrosoft.com/b2c_1_profile",
    },
  },
  authorityDomain: "jpatrickfulton.b2clogin.com",
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: "1e252383-1c48-435a-aec9-df0ef58744b6", // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Defaults to "https://login.microsoftonline.com/common"
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: "/", // Points to window.location.origin by default. You must register this URI on Azure portal/App Registration.
    postLogoutRedirectUri: "/", // Points to window.location.origin by default.
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // isIE, // Set this to "true" if you are having issues on IE11 or Edge. Remove this line to use Angular Universal
  },
  system: {
    /**
     * Below you can configure MSAL.js logs. For more information, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/msal-logging-js
     */
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        let loggingService: LoggingService;
        try {
          // attempt to inject if there is an injection context
          // this allows ApplicationInsights to work internally
          loggingService = inject(LoggingService);
        } catch (_) {
          // no injection context, no ApplicationInsights
          loggingService = new LoggingService(null);
        }

        const PREFIX = "[MSAL] ";

        switch (logLevel) {
          case LogLevel.Verbose: {
            loggingService.logDebug(PREFIX + message);
            break;
          }
          case LogLevel.Info: {
            loggingService.logInfo(PREFIX + message);
            break;
          }
          case LogLevel.Error: {
            loggingService.logError(PREFIX + message);
            break;
          }
          case LogLevel.Trace: {
            loggingService.logTrace(PREFIX + message);
            break;
          }
          case LogLevel.Warning: {
            loggingService.logWarn(PREFIX + message);
            break;
          }
        }
      },
      logLevel: LogLevel.Verbose, // TODO: turn down later
      piiLoggingEnabled: true, // TODO: change me later
    },
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [],
};

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "loginHint" property (such as a username). For more, visit:
 * https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-js-sso#sso-between-different-apps
 * If you do not receive the username claim in ID tokens, see also:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/FAQ.md#why-is-getaccountbyusername-returning-null-even-though-im-signed-in
 */
/*
export const silentRequest = {
    scopes: [],
    loginHint: "example@domain.net"
};
*/

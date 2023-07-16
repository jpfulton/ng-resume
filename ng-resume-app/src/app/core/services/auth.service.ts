/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from "@angular/core";
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
  MsalBroadcastService,
} from "@azure/msal-angular";
import { Subject, filter, takeUntil } from "rxjs";
import { PlatformService } from "./platform.service";
import { LoggingService } from "./logging.service";
import {
  EventMessage,
  EventType as MsalEventType,
  InteractionStatus,
  SsoSilentRequest,
  RedirectRequest,
  PopupRequest,
  InteractionType,
} from "@azure/msal-browser";
import {
  AuthenticationResult,
  AccountInfo,
  PromptValue,
  IdTokenClaims,
  InteractionRequiredAuthError,
} from "@azure/msal-common";
import { b2cPolicies } from "../constants/auth-constants";
import { LocalUser } from "../models/local-user";
import { createClaimsTable } from "../utils/claim-utils";
import { Claim } from "../models/claim";
import { getAuthenticatedApiClient } from "../utils/api-helpers";

type IdTokenClaimsWithPolicyId = IdTokenClaims & {
  acr?: string;
  tfp?: string;
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  isIframe = false;
  isLoggedIn = false;

  private readonly destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private platformService: PlatformService,
    private loggingService: LoggingService,
  ) {
    const window = this.platformService.getWindow();
    if (window) {
      this.isIframe = window !== window.parent && !window.opener;
    }
  }

  private setIsLoggedIn(): void {
    this.isLoggedIn = this.msalAuthService.instance.getAllAccounts().length > 0;
  }

  private checkAndSetActiveAccount(): void {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    const activeAccount = this.msalAuthService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.msalAuthService.instance.getAllAccounts().length > 0
    ) {
      const accounts = this.msalAuthService.instance.getAllAccounts();
      // add your code for handling multiple accounts here
      this.msalAuthService.instance.setActiveAccount(accounts[0]);
    }
  }

  getMsalService(): MsalService {
    return this.msalAuthService;
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        const popupRequest: PopupRequest = {
          ...this.msalGuardConfig.authRequest,
          ...userFlowRequest,
        } as PopupRequest;

        this.msalAuthService
          .loginPopup(popupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.msalAuthService.instance.setActiveAccount(response.account);
          });
      } else {
        const popupRequest: PopupRequest = {
          ...userFlowRequest,
        } as PopupRequest;

        this.msalAuthService
          .loginPopup(popupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.msalAuthService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        const redirectRequest: RedirectRequest = {
          ...this.msalGuardConfig.authRequest,
          ...userFlowRequest,
        } as RedirectRequest;

        this.msalAuthService.loginRedirect(redirectRequest);
      } else {
        const redirectRequest: RedirectRequest = {
          ...userFlowRequest,
        } as RedirectRequest;

        this.msalAuthService.loginRedirect(redirectRequest);
      }
    }
  }

  logout() {
    this.msalAuthService.logout();
  }

  async getActiveAccessToken(): Promise<string | undefined> {
    if (!this.isLoggedIn) return undefined;

    const request = {
      scopes: ["https://jpatrickfulton.onmicrosoft.com/api/test.write"],
      account: this.msalAuthService.instance.getActiveAccount()!,
    };

    let interactionRequired = false;

    let response = await this.msalAuthService.instance
      .acquireTokenSilent(request)
      .catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          interactionRequired = true;
        } else {
          throw error;
        }
      });

    if (interactionRequired) {
      response = await this.msalAuthService.instance.acquireTokenRedirect(
        request,
      );
    }

    const token = response?.accessToken;
    if (token && token !== "") return response?.accessToken;
    else return undefined;
  }

  getActiveAccount(): AccountInfo | undefined {
    if (!this.isLoggedIn) return undefined;
    return this.msalAuthService.instance.getActiveAccount()!;
  }

  getActiveIdToken(): string | undefined {
    if (!this.isLoggedIn) return undefined;
    return this.msalAuthService.instance.getActiveAccount()!.idToken;
  }

  isActiveUserInOneGroup(groups: string[]): boolean {
    if (!this.isLoggedIn) return false;

    let groupMatch = false;

    groups.forEach((group) => {
      const isInGroup = this.isActiveUserInGroup(group);
      if (isInGroup) {
        groupMatch = true;
      }
    });

    return groupMatch;
  }

  isActiveUserInGroup(group: string): boolean {
    if (!this.isLoggedIn) return false;

    const account = this.msalAuthService.instance.getActiveAccount();
    if (!account) return false;

    const claims = account.idTokenClaims;
    if (!claims) return false;

    const groupMembershipClaim: string = claims[
      "extension_GroupMembership"
    ] as string;
    if (!groupMembershipClaim) return false;

    const groupMemberships: string[] = groupMembershipClaim.split(",");

    let isInGroup = false;
    groupMemberships.map((groupMembership) => {
      if (groupMembership === group) isInGroup = true;
    });

    return isInGroup;
  }

  async getActiveUser(): Promise<LocalUser | undefined> {
    if (!this.isLoggedIn) return undefined;

    const apiClient = getAuthenticatedApiClient(this);
    const user = (await apiClient.profile.get()) as LocalUser;

    const account = this.msalAuthService.instance.getActiveAccount()!;
    const claims: Claim[] = createClaimsTable(account?.idTokenClaims as any);

    const claimsMap = new Map<string, Claim>(claims.map((i) => [i.name, i]));

    try {
      user.oid = claimsMap.get("oid")!.value as string;
      user.username = account.username;
      user.emails = claimsMap.get("emails")!.value as string[];
      user.identityProvider = claimsMap.get("idp")!.value as string;
      user.identityProviderAccessToken = claimsMap.get("idp_access_token")!
        .value as string;
      user.name = claimsMap.get("name")!.value as string;
      user.claimsMap = claimsMap;
      user.account = account;
    } catch (error) {
      this.loggingService.logError(
        "Unable to covert claims to LocalUser object.",
      );
    }

    return user;
  }

  destroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }

  initialize(): void {
    this.setIsLoggedIn();

    this.msalAuthService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window

    /**
     * You can subscribe to MSAL events as shown below. For more info,
     * visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md
     */
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === MsalEventType.ACCOUNT_ADDED ||
            msg.eventType === MsalEventType.ACCOUNT_REMOVED,
        ),
      )
      .subscribe(() => {
        if (this.msalAuthService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        } else {
          this.setIsLoggedIn();
          this.loggingService.logInfo("Login sucess. ");
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None,
        ),
        takeUntil(this.destroying$),
      )
      .subscribe(() => {
        this.setIsLoggedIn();
        this.checkAndSetActiveAccount();
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === MsalEventType.LOGIN_SUCCESS ||
            msg.eventType === MsalEventType.ACQUIRE_TOKEN_SUCCESS ||
            msg.eventType === MsalEventType.SSO_SILENT_SUCCESS,
        ),
        takeUntil(this.destroying$),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        const idtoken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;

        if (
          idtoken.acr === b2cPolicies.names.signUpSignIn ||
          idtoken.tfp === b2cPolicies.names.signUpSignIn
        ) {
          this.msalAuthService.instance.setActiveAccount(payload.account);
        }

        /**
         * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
         * from SUSI flow. "acr" claim in the id token tells us the policy (NOTE: newer policies may use the "tfp" claim instead).
         * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
         */
        if (
          idtoken.acr === b2cPolicies.names.editProfile ||
          idtoken.tfp === b2cPolicies.names.editProfile
        ) {
          // retrieve the account from initial sing-in to the app
          const originalSignInAccount = this.msalAuthService.instance
            .getAllAccounts()
            .find(
              (account: AccountInfo) =>
                account.idTokenClaims?.oid === idtoken.oid &&
                account.idTokenClaims?.sub === idtoken.sub &&
                ((account.idTokenClaims as IdTokenClaimsWithPolicyId).acr ===
                  b2cPolicies.names.signUpSignIn ||
                  (account.idTokenClaims as IdTokenClaimsWithPolicyId).tfp ===
                    b2cPolicies.names.signUpSignIn),
            );

          const signUpSignInFlowRequest: SsoSilentRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            account: originalSignInAccount,
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
        if (
          idtoken.acr === b2cPolicies.names.resetPassword ||
          idtoken.tfp === b2cPolicies.names.resetPassword
        ) {
          const signUpSignInFlowRequest: RedirectRequest | PopupRequest = {
            authority: b2cPolicies.authorities.signUpSignIn.authority,
            prompt: PromptValue.LOGIN, // force user to reauthenticate with their new password
            scopes: [],
          };

          this.login(signUpSignInFlowRequest);
        }

        return result;
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === MsalEventType.LOGIN_FAILURE ||
            msg.eventType === MsalEventType.ACQUIRE_TOKEN_FAILURE,
        ),
        takeUntil(this.destroying$),
      )
      .subscribe((result: EventMessage) => {
        // Checking for the forgot password error. Learn more about B2C error codes at
        // https://learn.microsoft.com/azure/active-directory-b2c/error-codes
        if (result.error && result.error.message.indexOf("AADB2C90118") > -1) {
          const resetPasswordFlowRequest: RedirectRequest | PopupRequest = {
            authority: b2cPolicies.authorities.resetPassword.authority,
            scopes: [],
          };

          this.login(resetPasswordFlowRequest);
        } else if (
          result.error &&
          result.error.message.indexOf("AADB2C90091") > -1
        ) {
          this.loggingService.logWarn("User canceled signin process.");
        }
      });
  }
}

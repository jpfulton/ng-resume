import { AccountInfo } from "@azure/msal-common";
import { Claim } from "./claim";
import { User } from "@jpfulton/ng-resume-api-browser-sdk/api";

export interface LocalUser extends User {
  oid: string;
  username: string;
  name: string;
  emails: string[];
  identityProvider: string;
  identityProviderAccessToken: string;
  claimsMap: Map<string, Claim>;
  account: AccountInfo;
}

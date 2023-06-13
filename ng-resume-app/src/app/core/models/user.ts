import { AccountInfo } from "@azure/msal-common";
import { Claim } from "./claim";

export interface User {
    oid: string;
    username: string;
    name: string;
    emails: string[];
    identityProvider: string;
    identityProviderAccessToken: string;
    claimsMap: Map<string, Claim>;
    account: AccountInfo;
}

import { NgcCookieConsentConfig } from "ngx-cookieconsent";

import { environment } from "src/environments/environment";

/**
 * Cookie consent popup configuration object. FYI, the ngx-cookieconsent
 * library is extremely opinionated about behavior and styling. Only use
 * hex color codes.
 *
 * Note:
 *  In a strange implementation choice, the cookie consent widget uses
 *  a cookie to persist the users opt-in or opt-out selection.
 *
 * Reference: https://tinesoft.github.io/ngx-cookieconsent/home
 */
export const COOKIE_CONSENT_CONFIG: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.cookieDomain,
  },
  position: "bottom",
  theme: "edgeless",
  palette: {
    popup: {
      background: "#000000",
      text: "#ffffff",
      link: "#ffffff",
    },
    button: {
      background: "#add8e6",
      text: "#000000",
      border: "transparent",
    },
  },
  type: "opt-out", // consent widget is displayed in full prior to minimizing after a user choice
  content: {
    message:
      "This website uses cookies for anayltics and to ensure you get the best experience on our website.",
    allow: "Accept cookies",
    deny: "Refuse cookies",
    link: "Learn more...",
    href: "/cookiepolicy",
    policy: "Cookies",
  },
};

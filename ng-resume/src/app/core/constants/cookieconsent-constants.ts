import { NgcCookieConsentConfig } from 'ngx-cookieconsent';

/**
 * Cookie consent popup configuration object. FYI, the ngx-cookieconsent
 * library is extremely opinionated about behavior and styling. Only use
 * hex color codes.
 * 
 * Reference: https://tinesoft.github.io/ngx-cookieconsent/home
 */
export const COOKIE_CONSENT_CONFIG : NgcCookieConsentConfig = {
    /*
    "cookie": {
      "domain": "jpatrickfulton.com" // TODO: determine if needed when only managing GA cookies
    },
    */
    "position": "bottom",
    "theme": "edgeless",
    "palette": {
      "popup": {
        "background": "#000000",
        "text": "#ffffff",
        "link": "#ffffff"
      },
      "button": {
        "background": "#add8e6",
        "text": "#000000",
        "border": "transparent"
      }
    },
    "type": "opt-out", // consent widget is displayed in full prior to minimizing after a user choice
    "content": {
      "message": "This website uses cookies for anayltics and to ensure you get the best experience on our website.",
      "allow": "Accept cookies",
      "deny": "Refuse cookies",
      "link": "Learn more...",
      "href": "/cookiepolicy",
      "policy": "Cookies"
    }
  };

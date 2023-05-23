import { NgcCookieConsentConfig } from 'ngx-cookieconsent';

/**
 * Cookie consent popup configuration object.
 * 
 * Reference: https://tinesoft.github.io/ngx-cookieconsent/home
 */
export const COOKIE_CONSENT_CONFIG : NgcCookieConsentConfig = {
    /*
    "cookie": {
      "domain": "jpatrickfulton.com"
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
        "background": "#f1d600",
        "text": "#000000",
        "border": "transparent"
      }
    },
    "type": "opt-in",
    "content": {
      "message": "This website uses cookies for anayltics and to ensure you get the best experience on our website.",
      "dismiss": "Got it!",
      "deny": "Refuse cookies"
    }
  };

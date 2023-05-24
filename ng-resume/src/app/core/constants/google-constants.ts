/**
 * Array of tracking ids from Google properties. gtag can be configured with
 * multiple properties.
 * 
 * Note: Associated cookie names remove the prefix "G-" in their naming convention.
 */
export const GOOGLE_TRACKING_IDS : string[] = [
    "G-CH27KKMKZM"
];

/**
 * All gtag related cookies are named with this prefix. The "main" cookie
 * uses only this string. Property cookies use this prefix + "_" and the
 * last portion of the tracking id with "G-" trimmed from the front of the
 * string.
 */
export const GOOGLE_COOKIE_PREFIX = "_ga";

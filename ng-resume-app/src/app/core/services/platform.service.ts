/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable @typescript-eslint/ban-types */

import { isPlatformServer, isPlatformBrowser, DOCUMENT } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

/**
 * Encapsulates logic to determine the platfrom of the current execution environment.
 * Supports branching logic in components and other services based on execution platform.
 * However, platform branching logic should generally be used as a last resort and other
 * strategies should be utilized when possible as described in the reference documentation
 * below.
 *
 * Provides access to commonly used global objects with primitive server-side
 * implementations when executing on server.
 *
 * Also, limits the need for line specific linting overrides associated with the use
 * of the Object interface to be spread accross multiple files.
 *
 * References:
 *  https://github.com/angular/universal/blob/main/docs/gotchas.md
 */
@Injectable({
  providedIn: "root",
})
export class PlatformService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  /**
   * @returns {boolean} Returns true if execution is taking place in a browser platform.
   */
  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * @returns {boolean} Returns true if execution is taking place in a server platform.
   */
  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  /**
   * @returns {Document} Returns the document global object.
   */
  getDocument(): Document {
    return this.document;
  }

  /**
   * @returns {Window | null} Returns the window global object.
   */
  getWindow(): Window | null {
    return this.document.defaultView;
  }

  /**
   * @returns {Location} Returns the location global object.
   */
  getLocation(): Location {
    return this.document.location;
  }
}

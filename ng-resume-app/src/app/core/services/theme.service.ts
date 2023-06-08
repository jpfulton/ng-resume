import { BehaviorSubject } from 'rxjs';
import { ApplicationRef, Injectable } from '@angular/core';

import { PlatformService } from '../services/platform.service';

/**
 * Service to observe browser and operation system preferences towards
 * light or dark themes.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // constants for theme event strings
  LIGHT_MODE = "light-mode";
  DARK_MODE = "dark-mode"; 

  /**
   * Theme event behavior subject to allow subscriptions to theme events.
   */
  theme = new BehaviorSubject(this.LIGHT_MODE);

  constructor(
    private applicationRef: ApplicationRef,
    private platformService: PlatformService
  )
  { 
    if (this.platformService.isServer()) return; // do nothing if in SSR environment

    const window = this.platformService.getWindow();

    const isDarkMode =
      window?.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (isDarkMode) this.theme.next(this.DARK_MODE);

    // add a listener to changes in the prefered color scheme per the browser
    // this can change via OS settings alteration or in a setting where dark mode
    // is entered at dusk
    window?.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      const turnOnDarkMode = e.matches;
      this.theme.next(turnOnDarkMode ? this.DARK_MODE : this.LIGHT_MODE);

      this.applicationRef.tick(); // refresh UI
    }, true);
  }

}

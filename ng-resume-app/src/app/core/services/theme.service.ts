import { BehaviorSubject } from 'rxjs';
import { ApplicationRef, Injectable } from '@angular/core';

import { PlatformService } from '../services/platform.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  LIGHT_MODE = "light-mode";
  DARK_MODE = "dark-mode"; 

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

    window?.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      const turnOnDarkMode = e.matches;
      this.theme.next(turnOnDarkMode ? this.DARK_MODE : this.LIGHT_MODE);

      this.applicationRef.tick(); // refresh UI
    }, true);
  }

}

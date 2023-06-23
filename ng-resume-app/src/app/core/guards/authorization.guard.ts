import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { LoggingService } from '../services/logging.service';

export const authorizationGuard: CanActivateFn = (route, state) => {

  const logService: LoggingService = inject(LoggingService);
  const authService: AuthService = inject(AuthService);

  if (!authService.isLoggedIn) {
    logService.logInfo("No logged in user account. Refusing to activate route.");
    return false;
  }

  /*
  const roles = route.data["roles"] as string[];

  authService.getActiveUser().then((user) => {
    const groups = user?.memberOf;
    
  });
  */

  return true;
};

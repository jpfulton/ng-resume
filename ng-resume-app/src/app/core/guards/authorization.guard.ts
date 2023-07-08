import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { LoggingService } from '../services/logging.service';

export const authorizationGuard: CanActivateFn = async (route) => {

  const logService: LoggingService = inject(LoggingService);
  const authService: AuthService = inject(AuthService);

  if (!authService.isLoggedIn) {
    logService.logInfo("No logged in user account. Refusing to activate route.");
    return false;
  }

  const roles = route.data["roles"] as string[];
  const groupMatch = authService.isActiveUserInOneGroup(roles);

  if (groupMatch) {
    logService.logInfo("Active user is in role. Activating route.");
  }
  else {
    logService.logInfo("Active user is not in specified role(s). Refusing to activate route.");
  }
  return groupMatch;
};

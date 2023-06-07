import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';

import { LoggingService } from './core/services/logging.service';
import { ServerLoggingService } from './core/services/server-logging.service';
import { ErrorService } from './core/services/error.service';
import { ServerErrorService } from './core/services/server-error.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: LoggingService, useClass: ServerLoggingService },
    { provide: ErrorService, useClass: ServerErrorService }
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
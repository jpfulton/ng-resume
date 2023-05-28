import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from '../app.module';
import { AppComponent } from '../app.component';

import { ErrorService } from '../core/services/error.service';
import { ServerErrorService } from '../core/services/server-error.service';
import { LoggingService } from '../core/services/logging.service';
import { ServerLoggingService } from '../core/services/server-logging.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: ErrorService, useClass: ServerErrorService },
    { provide: LoggingService, useClass: ServerLoggingService }
  ],
})
export class AppServerModule {}

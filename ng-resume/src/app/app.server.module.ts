import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { ErrorService } from './core/services/error.service';
import { ServerErrorService } from './core/services/server-error.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: ErrorService, useClass: ServerErrorService }
  ],
})
export class AppServerModule {}

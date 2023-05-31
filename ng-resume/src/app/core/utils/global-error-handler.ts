import { Injectable, NgZone } from "@angular/core";
import { LoggingService } from "../services/logging.service";
import { ErrorService } from "../services/error.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

import { IErrorService } from '@microsoft/applicationinsights-angularplugin-js';

/**
 * Custom global error handler.
 */
@Injectable({
    providedIn: "root"
})
export class GlobalErrorHandler implements IErrorService {

    constructor(
        private errorService: ErrorService,
        private loggingService: LoggingService,
        private router: Router,
        private zone: NgZone
    ) {}

    /**
     * Handle incoming client or server error.
     * @param {Error | HttpErrorResponse} error Client or server error object.
     */
    handleError(error: Error | HttpErrorResponse): void {
        let message, stackTrace;

        if (error instanceof Error) {
            message = this.errorService.getClientMessage(error);
            stackTrace = this.errorService.getClientStacktrace(error);
        }
        else {
            message = this.errorService.getServerMessage(error);
            stackTrace = this.errorService.getServerStacktrace(error);
        }

        this.loggingService.logError(message, stackTrace);
        this.zone.run(() => this.router.navigate(['error'], { skipLocationChange: true }));
    }
}

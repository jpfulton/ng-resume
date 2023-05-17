import { ErrorHandler, Injectable } from "@angular/core";
import { LoggingService } from "../services/logging.service";
import { ErrorService } from "../services/error.service";
import { HttpErrorResponse } from "@angular/common/http";

/**
 * Custom global error handler.
 */
@Injectable({
    providedIn: "root"
})
export class GlobalErrorHandler implements ErrorHandler {

    constructor(
        private errorService: ErrorService,
        private loggingService: LoggingService
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
    }
}

import { ErrorHandler, inject } from "@angular/core";
import { LoggingService } from "../services/logging.service";
import { ErrorService } from "../services/error.service";
import { HttpErrorResponse } from "@angular/common/http";

export class GlobalErrorHandler implements ErrorHandler {
    errorService: ErrorService = inject(ErrorService);
    loggingService: LoggingService = inject(LoggingService);

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

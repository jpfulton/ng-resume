import { Component, NgZone } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ErrorDialogService } from "../../services/error-dialog.service";

@Component({
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.scss"],
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
})
export class ErrorDialogComponent {
  constructor(
    private errorDialogService: ErrorDialogService,
    private zone: NgZone,
  ) {}

  refresh(): void {
    window.location.href = "/";
  }

  close(): void {
    this.zone.run(() => {
      this.errorDialogService.closeDialog();
    });
  }
}

import { Component, NgZone } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDialogService } from '../../services/error-dialog.service';

@Component({
  selector: 'app-unauthorized-dialog',
  templateUrl: './unauthorized-dialog.component.html',
  styleUrls: ['./unauthorized-dialog.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule
  ]
})
export class UnauthorizedDialogComponent {
  constructor(
    private errorDialogService: ErrorDialogService,
    private zone: NgZone
  ) { }

  close(): void {
    this.zone.run(() => {
      this.errorDialogService.closeDialog();
    });
  }
}

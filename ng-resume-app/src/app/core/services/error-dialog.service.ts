import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  private opened = false;
  private dialogRef: MatDialogRef<ErrorDialogComponent> | null = null;

  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    if (!this.opened) {
      this.opened = true;

      this.dialogRef = this.dialog.open(ErrorDialogComponent, {
        maxHeight: "100%",
        maxWidth: "100%",
        hasBackdrop: true,
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  closeDialog(): void {
    this.dialogRef?.close();
  }
}

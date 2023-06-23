import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import { TimeoutDialogComponent } from '../components/timeout-dialog/timeout-dialog.component';
import { UnauthorizedDialogComponent } from '../components/unauthorized-dialog/unauthorized-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  private opened = false;
  private dialogRef: MatDialogRef<ErrorDialogComponent | TimeoutDialogComponent | UnauthorizedDialogComponent> | null = null;

  constructor(private dialog: MatDialog) {}

  openErrorDialog(): void {
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

  openTimeoutDialog(): void {
    if (!this.opened) {
      this.opened = true;

      this.dialogRef = this.dialog.open(TimeoutDialogComponent, {
        maxHeight: "100%",
        maxWidth: "100%",
        hasBackdrop: true,
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  openUnauthorizedDialog(): void {
    if (!this.opened) {
      this.opened = true;

      this.dialogRef = this.dialog.open(UnauthorizedDialogComponent, {
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

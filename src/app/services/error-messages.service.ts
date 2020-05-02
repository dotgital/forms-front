import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessagesService {

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  showError(msg: string) {
    this.snackBar.open(msg, 'close', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: 'alert-error'
    });
  }
}

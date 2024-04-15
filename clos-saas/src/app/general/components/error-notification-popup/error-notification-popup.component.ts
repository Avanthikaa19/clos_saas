import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-notification-popup',
  templateUrl: './error-notification-popup.component.html',
  styleUrls: ['./error-notification-popup.component.scss']
})
export class ErrorNotificationPopupComponent implements OnInit {

  removeFile: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ErrorNotificationPopupComponent>,
  ) { }

  ngOnInit(): void {
  }
  onApplyClick() {
    this.removeFile = true;
    this.dialogRef.close(true);
  }

}

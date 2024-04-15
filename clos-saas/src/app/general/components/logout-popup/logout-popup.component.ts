import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.scss']
})
export class LogoutPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LogoutPopupComponent>,
  ) { }

  ngOnInit(): void {
  }
  onCancelClick() {
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-log-modal',
  templateUrl: './error-log-modal.component.html',
  styleUrls: ['./error-log-modal.component.scss']
})
export class ErrorLogModalComponent implements OnInit {

  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ErrorLogModalComponent>) {
    this.errorMessage = data; // ERROR MESSAGE STRING VALUE
  }

  ngOnInit(): void {
  }

  // CLOSING MODAL FUNCTION
  closeModal() {
    this.dialogRef.close();
  }

}

import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-rejection-confirmation',
  templateUrl: './rejection-confirmation.component.html',
  styleUrls: ['./rejection-confirmation.component.scss']
})
export class RejectionConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RejectionConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
  }
  onReject(): void {
    // Handle the rejection logic here
    // For example, you can send a rejection request to your backend
    // After handling the rejection, close the dialog
    this.dialogRef.close();
  }

  onRejectAndRequestInfo(): void {
    // Handle the "Reject & Request Info" logic here
    // For example, you can send a rejection request to your backend
    // and also request additional information
    // After handling the rejection and request, close the dialog
    this.dialogRef.close();
  }
  onClose(): void {
    // Close the dialog when the close icon is clicked
    this.dialogRef.close();
  }
}

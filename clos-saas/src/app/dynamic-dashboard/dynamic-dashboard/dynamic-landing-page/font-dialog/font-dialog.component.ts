import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-font-dialog',
  templateUrl: './font-dialog.component.html',
  styleUrls: ['./font-dialog.component.scss']
})
export class FontDialogComponent {
  selectedFontStyle:string='';
  selectedFontColor:string='';
  constructor(public dialogRef: MatDialogRef<FontDialogComponent>) { }
  onCancelClick(){
    this.dialogRef.close();
  }
}

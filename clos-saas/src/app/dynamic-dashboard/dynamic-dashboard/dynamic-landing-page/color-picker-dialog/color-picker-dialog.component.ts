import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.scss']
})
export class ColorPickerDialogComponent {
  selectedColor: string = '';

  constructor(public dialogRef: MatDialogRef<ColorPickerDialogComponent>) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

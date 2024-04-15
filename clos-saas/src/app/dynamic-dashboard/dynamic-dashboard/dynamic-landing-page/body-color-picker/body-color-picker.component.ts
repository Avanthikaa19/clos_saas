import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-body-color-picker',
  templateUrl: './body-color-picker.component.html',
  styleUrls: ['./body-color-picker.component.scss']
})
export class BodyColorPickerComponent {
  selectedbodybgColor: string = '';

  constructor(public dialogRef: MatDialogRef<BodyColorPickerComponent>) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

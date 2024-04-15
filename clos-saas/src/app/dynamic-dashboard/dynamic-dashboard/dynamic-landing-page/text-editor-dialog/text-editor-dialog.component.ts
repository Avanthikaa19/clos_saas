import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-text-editor-dialog',
  templateUrl: './text-editor-dialog.component.html',
  styleUrls: ['./text-editor-dialog.component.scss']
})
export class TextEditorDialogComponent {
  editedText: string = '';

  constructor(public dialogRef: MatDialogRef<TextEditorDialogComponent>) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}

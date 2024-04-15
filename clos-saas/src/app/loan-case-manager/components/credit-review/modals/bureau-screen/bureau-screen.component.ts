import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bureau-screen',
  templateUrl: './bureau-screen.component.html',
  styleUrls: ['./bureau-screen.component.scss']
})
export class BureauScreenComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BureauScreenComponent>,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-condition-alertbox',
  templateUrl: './condition-alertbox.component.html',
  styleUrls: ['./condition-alertbox.component.scss']
})
export class ConditionAlertboxComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConditionAlertboxComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
acceptCondition(){
  this.data.data.configId=0;
  this.data.data.configName="";
  this.data.data.flow_type="NULL";
  console.log( this.data);
  this.dialogRef.close(this.data);

}
}

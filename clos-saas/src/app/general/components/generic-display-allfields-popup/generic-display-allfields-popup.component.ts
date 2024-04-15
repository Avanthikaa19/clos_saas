import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnDefinition } from '../generic-data-table/generic-data-table.component';

@Component({
  selector: 'app-generic-display-allfields-popup',
  templateUrl: './generic-display-allfields-popup.component.html',
  styleUrls: ['./generic-display-allfields-popup.component.scss']
})
export class GenericDisplayAllfieldsPopupComponent implements OnInit {
  allColumns: ColumnDefinition[] = [];
  selectAllInput: boolean;
  fieldData:boolean=false;
    constructor(
    public dialogRef: MatDialogRef<GenericDisplayAllfieldsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public columns: any,
  ) {
     this.allColumns = JSON.parse(JSON.stringify(columns.colData));
    console.log("columndefinition ",this.allColumns);
    this.selectList();
   }

  ngOnInit(): void {
    //this.selectAllInput = true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  onApply() {
    this.dialogRef.close({modifiedColumns: this.allColumns, displayAll: true });
  }

  selectAll(e){
    if (e.checked == true) {
      this.selectAllInput = true
    }
       console.log(e, this.selectAllInput)
    if (this.allColumns.length > 0) {
      // this.selectAllInput = true
      console.log(this.allColumns, 'data', this.selectAllInput)
      for (var column of Object.values(this.allColumns.slice(0, this.allColumns.length))) {
        column.columnDisable = this.selectAllInput;
      }
    }
    else if (this.allColumns.length > 0) {
      // this.selectAllInput = true
      for (let column of Object.values(this.allColumns.slice(0, this.allColumns.length))) {
        column.columnDisable = this.selectAllInput;
      }
    }   
  }

  // CHECK TO DISPLAY ALL FIELDS SELECT IS INTERMEDIATE OR NOT
  selectList() {
    console.log('ALL COLUMNS', this.allColumns)
    let checkedCount = 0;
    let checkArray = [];
    this.allColumns.forEach(col => {  
      if (!col.viewSticky === true || col.viewSticky === null) {
        checkArray.push(col.columnDisable);
        if (col.columnDisable) {
          checkedCount++
        }
      }
      if (col.fieldName.startsWith('$') || col.fieldName.startsWith('status')){
        col.columnDisable=true;
        checkArray.push(col.columnDisable);
        if (col.columnDisable) {
          checkedCount++
        }
      }
    })
    console.log('CHECKED COUNT', checkedCount);
    console.log('CHECKED ARRAY LENGTH', checkArray.length)
    if (checkedCount > 0 && checkedCount < checkArray.length) {
      this.fieldData = true;
    }
    else if (checkedCount == checkArray.length) {
      this.fieldData = false;
      this.selectAllInput = true;
    }
    else {
      this.fieldData = false;
      this.selectAllInput = true;
    }
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnDefinition } from '../share-data-table/share-data-table.component';

@Component({
  selector: 'app-display-all-fields',
  templateUrl: './display-all-fields.component.html',
  styleUrls: ['./display-all-fields.component.scss']
})
export class DisplayAllFieldsComponent implements OnInit {

  allColumns: ColumnDefinition[] = [];
  selectAllInput: boolean;
  fieldData:boolean=false;
    constructor(
    public dialogRef: MatDialogRef<DisplayAllFieldsComponent>,
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
    
    this.dialogRef.close(this.allColumns);
  }

  selectAll(e){
    if (e.checked == true) {
      this.selectAllInput = true
    }
    console.log(e, this.selectAllInput)
    if (this.allColumns.length > 0) {
      // this.selectAllInput = true
      console.log(this.allColumns, 'data', this.selectAllInput)
      //  var tempColumnData = 
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
      if (!col.hideExport === true || col.hideExport === null) {
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

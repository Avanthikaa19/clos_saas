import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnDefinition } from 'src/app/c-los/models/clos-table';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Component({
  selector: 'app-clos-common-export',
  templateUrl: './clos-common-export.component.html',
  styleUrls: ['./clos-common-export.component.scss']
})
export class ClosCommonExportComponent implements OnInit {
  
  selectAllInput: boolean;
  exportColumns: ColumnDefinition[] = [];
  exportDatas: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ClosCommonExportComponent>,
    @Inject(MAT_DIALOG_DATA) public columns: any,

  ) {
    this.exportColumns = columns.colData;
    this.selectExport();
  }


  ngOnInit(): void {
    this.selectAllInput = true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onExportClick(format: string) {
    console.log("export", this.exportColumns);
    let selectedColumns: ColumnDefinition[] = []
    this.exportColumns.forEach(column => {
      if (column.isExport == true && column.fieldName) {
        selectedColumns.push(column)
      }
    })
    let exportFields = {
      columns: selectedColumns, format: format
    }
    console.log("export", exportFields);
    this.dialogRef.close(JSON.stringify(exportFields));
  }

  selectAllExport(e) {
    if (e.checked == true) {
      this.selectAllInput = true;
    }
    if (this.exportColumns.length > 0) {
      for (let column of Object.values(this.exportColumns)) {
        column.isExport = this.selectAllInput;
        console.log("1", column.isExport)
      }
    }
    else if (this.exportColumns.length > 0) {
      for (let column of Object.values(this.exportColumns)) {
        column.isExport = this.selectAllInput;
        console.log("2", column.isExport)

      }
     
    }
  }
  // CHECK TO DISPLAY ALL FIELDS SELECT IS INTERMEDIATE OR NOT
  selectExport() {
    console.log('ALL COLUMNS', this.exportColumns)
    let checkedCount = 0;
    let checkArray = [];
    this.exportColumns.forEach(col => {
      if (!col.hideExport === true || col.hideExport === null) {
        checkArray.push(col.columnDisable);
        if (col.isExport) {
          checkedCount++
        }
      }
    })
    console.log('CHECKED COUNT', checkedCount);
    console.log('CHECKED ARRAY LENGTH', checkArray.length)
    if (checkedCount >= 0 && checkedCount < checkArray.length) {
      this.exportDatas = true;
    }
    else if (checkedCount == checkArray.length) {
      this.exportDatas = false;
      this.selectAllInput = true;
    }
    else {
      this.exportDatas = false;
      this.selectAllInput = true;
    }
  }
}
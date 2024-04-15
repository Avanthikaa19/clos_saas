import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, filter, of, switchMap, timer } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { DownloadJob } from 'src/app/loan-application/common/download.service';
import { LoanCaseManagerServiceService } from 'src/app/loan-case-manager/service/loan-case-manager-service.service';
import { HouseKeepingService } from 'src/app/loan-monitor/service/house-keeping.service';

@Component({
  selector: 'app-house-keeping-export',
  templateUrl: './house-keeping-export.component.html',
  styleUrls: ['./house-keeping-export.component.scss']
})
export class HouseKeepingExportComponent implements OnInit {

  selectAllInput: boolean;
  exportColumns: ColumnDefinition[] = [];
  exportDatas: boolean = false;
  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;
  constructor(
    public housekeepingService: HouseKeepingService,
    private casemanagementService: LoanCaseManagerServiceService,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<HouseKeepingExportComponent>,
    @Inject(MAT_DIALOG_DATA) public columns: any,

  ) {
    this.exportColumns = this.declareInitialColumns();
    this.selectExport();
  }

  ngOnInit(): void {
    this.selectAllInput = true;
  }

  declareInitialColumns() {
    let column = [
      {
        fieldName: "dataBase",
        displayName: "Data Base",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "tableName",
        displayName: "Table Name",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "logic",
        displayName: "Choose Logic",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "process",
        displayName: "Choose Process",
        lockColumn: false,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "dateFrom",
        displayName: "Choose Date",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        dateFormat: "dd MMM yyyy",
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      // {
      //   fieldName: "dateTo",
      //   displayName: "Date To",
      //   lockColumn: true,
      //   sortAsc: null,
      //   searchText: "",
      //   isExport: true,
      //   dateFormat: "dd MMM yyyy",
      //   columnDisable: true,
      //   dropDownList: [],
      //   searchItem: [],
      // },
      {
        fieldName: "method",
        displayName: "Choose Method",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        columnDisable: true,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "archiveTable",
        displayName: "Archive Table",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        isExport: true,
        filterDisable: true,
        columnDisable: false,
        dropDownList: [],
        searchItem: [],
      },
    ]
    return column;
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

  // EXPORT FUNCTION 
  onExportBtnClick(format: any) {
    this.housekeepingService.getExportHouseKeeping(format, this.exportColumns).subscribe(res => {
      this.currentDownloadJob = res;
      if (this.downloadStatusSubscription) {
        this.downloadStatusSubscription.unsubscribe();
      }
      this.downloadStatusSubscription = timer(0, 2000)
        .pipe(
          switchMap(() => {
            return this.casemanagementService.getJob(res.id)
              .pipe(catchError(err => {
                return of(undefined);
              }));
          }),
          filter(data => data !== undefined)
        )
        .subscribe(data => {
          this.currentDownloadJob = data;
          if (data.isReady) {
            this.downloadStatusSubscription.unsubscribe();
            this.currentDownloadJob = null;
            //Download file API
            this.casemanagementService.getFileByJob(res.id).subscribe(
              (response: any) => {
                this.downloadFile(response, format);
              },
              err => {
                console.error(err);
              }
            )
          }
        });
    })
  }

  // EXPORT FORMAT  
  downloadFile(res, format: string) {
    let data = [res];
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyyMMdd hhmmss');
    if (format == 'xlsx') {
      var blob = new Blob(data, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else if (format == 'csv') {
      var blob = new Blob([res], { type: 'text/csv' });
    } else if (format == 'xls') {
      var blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    } else if (format == 'pdf') {
      var blob = new Blob([res], { type: 'application/pdf' });
    } else {
      var blob = new Blob(data, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    var url = window.URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = `DepositerBase${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }
}

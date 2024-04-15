import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of, Subscription, timer, switchMap, filter } from 'rxjs';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { DownloadJob } from 'src/app/loan-application/common/download.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';
import { DepositerbaseViewdetailsPopupComponent } from '../depositerbase-viewdetails-popup/depositerbase-viewdetails-popup.component';

@Component({
  selector: 'app-reprocess-application',
  templateUrl: './reprocess-application.component.html',
  styleUrls: ['./reprocess-application.component.scss']
})
export class ReprocessApplicationComponent implements OnInit {

  fieldName: any[];
  displayName: any[];
  datefieldName: any[];
  listDynamicColumns: ColumnDefinition[] = [];
  reprocessApplicationColumn: ColumnDefinition[] = [];
  extraColumns: ColumnDefinition[] = [];
  pageData: PageData = new PageData();
  loadingItems: boolean = false;
  reprocessData: any[];

 // EXPORT
 downloadStatusSubscription: Subscription;
 currentDownloadJob: DownloadJob;

 
  constructor(
    private casemanagementService: LoanCaseManagerServiceService,
    private defaultService: LoanServiceService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public encryptDecryptService: EncryptDecryptService

  ) {
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
  }

  ngOnInit(): void {
    this.getTableFieldsName();
  }

  // GET  TABLE FIELDS 
  getTableFieldsName() {
    this.casemanagementService.getFieldsName().subscribe(res => {
      this.fieldName = res['fieldName'];
      this.displayName = res['displayName'];
      this.dynamicColumndefinitions();
    })
  }

  //DYNAMIC COLUMN DEFINITION CREATION
  dynamicColumndefinitions() {
    console.log('FIELDS NAME', this.fieldName);
    console.log('DATE FIELDS NAME', this.datefieldName);
    for (let i = 0; i < this.fieldName.length; i++) {
      // this.fieldsName?.forEach(value => {
      if (this.datefieldName?.includes(this.fieldName[i])) {
        let columnDef: ColumnDefinition = new ColumnDefinition();
        columnDef.fieldName = this.fieldName[i];
        columnDef.displayName = this.displayName[i];
        columnDef.lockColumn = false;
        columnDef.searchText = [];
        columnDef.searchItem = [];
        columnDef.sortAsc = null;
        columnDef.columnDisable = false;
        columnDef.isExport = true;
        columnDef.dateFormat = 'dd MMM yyyy';
        this.listDynamicColumns.push(columnDef);
      }
      else {
        let columnDef: ColumnDefinition = new ColumnDefinition();
        columnDef.fieldName = this.fieldName[i];
        columnDef.displayName = this.displayName[i];
        columnDef.lockColumn = false;
        columnDef.searchText = [];
        columnDef.searchItem = [];
        columnDef.sortAsc = null;
        columnDef.columnDisable = false;
        columnDef.isExport = true

        this.listDynamicColumns.push(columnDef);
      }

      this.listDynamicColumns.forEach((e) => {
        if (e.fieldName === 'id' || e.fieldName === 'finsurgeId' || e.fieldName === 'appmBank' || e.fieldName === 'appmNbr' || e.fieldName === 'appMrefer') {
          e.columnDisable = true;
          e.isExport = true;
        }
      })
      // }
    }
    this.reprocessApplicationColumn = this.listDynamicColumns
    this.getExtraColumns();
  }

  getExtraColumns() {
    this.extraColumns = [
      {
        fieldName: "_checkbox",
        displayName: "",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: false,
        hideExport: true,
        filterDisable: true,
        inOrder: true,
      },
      {
        fieldName: "$reprocess_view_details",
        displayName: "View Details",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: false,
        hideExport: true,
        filterDisable: true,
        inOrder: false,

      },
      {
        fieldName: "pulled_date",
        displayName: "Pulled Date",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: true,
        hideExport: false,
        filterDisable: false,
        inOrder: false,

      },
      {
        fieldName: "reject_code",
        displayName: "Reject Code",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: true,
        hideExport: false,
        filterDisable: false,
        inOrder: false,

      },
      {
        fieldName: "current_status",
        displayName: "Current Status",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: true,
        hideExport: false,
        filterDisable: false,
        inOrder: false,

      },
      {
        fieldName: "$reprocess",
        displayName: "Reprocess",
        lockColumn: true,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: false,
        hideExport: true,
        filterDisable: true,
        inOrder: false,

      },
    ];
    for (let columData of this.extraColumns) {
      if (columData.inOrder === true) {
        this.reprocessApplicationColumn.unshift(columData)
      }
      if (columData.inOrder === false) {
        this.reprocessApplicationColumn.push(columData)
      }
    }
    this.getreprocessApplicationListData(this.pageData);
  }

  getreprocessApplicationListData(pageData: PageData) {
    this.loadingItems = true;
    this.defaultService.getviewList(this.reprocessApplicationColumn, pageData.currentPage, pageData.pageSize).subscribe(res => {
      console.log("res", res);
      this.loadingItems = false;
      this.reprocessData = res['data']
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }

    //  FILTER DROP DOWN FUNCTION 
    onApplyFilter(columnDetail: any) {
      this.defaultService.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
        columnDetail.column.dropDownList = res;
      })
      this.changeColumnData(columnDetail.column)
    }
  
    // FILTER  FUNCTIONS
    changeColumnData(columnDefinition) {
      this.reprocessApplicationColumn.forEach(column => {
        if (column.fieldName == columnDefinition.fieldName) {
          column = columnDefinition
        }
      })
    }
    columnChange(event: ColumnDefinition[]) {
      this.reprocessApplicationColumn = event;
      this.getreprocessApplicationListData(this.pageData);
    }

      //BUTTON CLICK FUNCTION
  detailClick(event: any) {
    if (event.col && event.col.displayName === 'View Details') {
      console.log("event click", event.data.id)
      const dialogRef = this.dialog.open(DepositerbaseViewdetailsPopupComponent, {
            width: '1400px', height: '850px', data: event.data.id
          });
    }}


      // EXPORT FUNCTION 
  reprocessExplort(event: any) {
    this.defaultService.duplicateListExport(event.columns, event.format, this.pageData.currentPage).subscribe(res => {
      this.currentDownloadJob = res;
      if (this.downloadStatusSubscription) {
        this.downloadStatusSubscription.unsubscribe();
      }
      this.downloadStatusSubscription = timer(0, 2000)
        .pipe(
          switchMap(() => {
            return this.defaultService.getJob(res.id)
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
            this.defaultService.getFileByJob(res.id).subscribe(
              (response: any) => {
                this.downloadFile(response, event.format);
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
    anchor.download = `Reprocess Application`;
    anchor.href = url;
    anchor.click();
  }

}

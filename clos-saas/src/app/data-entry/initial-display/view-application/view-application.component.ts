import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { ClickEvent, ColumnDefinition, ExportFile, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { DownloadJob } from 'src/app/loan-application/common/download.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { StepperMainComponent } from '../data-entry-home/stepper-main/stepper-main.component';
import { ViewResultStatusComponent } from '../view-result-status/view-result-status.component';
import { ApplicationDetailPopupComponent } from '../application-detail-popup/application-detail-popup.component';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss']
})
export class ViewApplicationComponent implements OnInit {

  applicationColumns: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];

  dataRequest: ExportFile = { columnDefinitions: [] };
  pageData: PageData = new PageData();
  applicationLogData: any[];
  loadingItems: boolean;
  fieldsName: any[];
  displayName: any[];
  columns: ColumnDefinition[];
  extraColumns: ColumnDefinition[];
  currentUrl: string;
  fileContent: any;
  docPreviewWindow: any;
  stickyCondition: boolean = null;
  isView: boolean = true;
  datefieldsName: any[];

  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;


  constructor(
    private defaultService: LoanServiceService,
    public dialog: MatDialog,
    private duplicateService: DuplicateCheckingService,
    public notifierService: NotifierService,
    private router: Router,
    public encryptDecryptService: EncryptDecryptService,
    public datepipe: DatePipe
  ) {
    this.getDateFieldsName()
    this.applicationColumns = []
    this.loadingItems = true;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.pageData.count;
    this.applicationLogData = [];
    this.currentUrl = window.location.href;


  }

  ngOnInit(): void {
    this.getTableFieldsName();

  }


  getExtraColumns() {
    this.extraColumns = [
      // {
      //   fieldName: "initialScore",
      //   displayName: "initial Score",
      //   lockColumn: false,
      //   columnDisable: true,
      //   searchText: [],
      //   sortAsc: null,
      //   isExport: false,
      //   hideExport: true,
      //   filterDisable:true,
      //   viewSticky:false,
      //   isBoolean:true,

      // },
      // {
      //   fieldName: "initialStatus",
      //   displayName: "initial Status",
      //   lockColumn: false,
      //   columnDisable: true,
      //   searchText: [],
      //   sortAsc: null,
      //   isExport: false,
      //   hideExport: true,
      //   filterDisable:true,
      //   viewSticky:false

      // },
      {
        fieldName: "$view_details",
        displayName: "View Details",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: false,
        hideExport: true,
        filterDisable: true,
        viewSticky: false

      },
      {
        fieldName: "$document_preview",
        displayName: "Document Preview",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: false,
        hideExport: true,
        filterDisable: true,
        viewSticky: false

      },
      {
        fieldName: "$document_preview",
        displayName: "View Result Status",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: false,
        hideExport: true,
        filterDisable: true,
        viewSticky: false

      },
      {
        fieldName: "status",
        displayName: "Status",
        lockColumn: false,
        columnDisable: true,
        searchText: [],
        sortAsc: null,
        isExport: true,
        hideExport: false,
        filterDisable: false,
        viewSticky: false

      },
      // {
      //   fieldName: "$duplicate_preview",
      //   displayName: "Duplicate Preview",
      //   lockColumn: false,
      //   columnDisable: true,
      //   searchText: [],
      //   sortAsc: null,
      //   isExport: false,
      //   hideExport: true,
      //   filterDisable:true,
      //   viewSticky:false

      // }
    ];
    for (let columData of this.extraColumns) {
      this.applicationColumns.push(columData)
    }
    this.getShareDetailsData(this.pageData);
  }

  //LISTING FUNCTION

  getShareDetailsData(pageData: PageData) {
    this.loadingItems = true;
    this.defaultService.getviewList(this.applicationColumns, pageData.currentPage, pageData.pageSize).subscribe(res => {
      console.log("res", res);
      this.loadingItems = false;
      this.applicationLogData = res['data']
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }

  // GET  TABLE FIELDS 

  getTableFieldsName() {
    this.defaultService.getDataentryFieldsName().subscribe(res => {
      this.fieldsName = res['fieldName'];
      this.displayName = res['displayName'];
      this.dynamicColumndefinitions()

    })
  }





  getDateFieldsName() {
    this.defaultService.getapplicationdateFieldsName().subscribe(res => {
      this.datefieldsName = res['fieldName'];
    })
  }

  //DYNAMIC COLUMN DEFINITION CREATION

  dynamicColumndefinitions() {
    console.log('FIELDS NAME', this.fieldsName);
    console.log('DATE FIELDS NAME', this.datefieldsName);
    for (let i = 0; i < this.fieldsName.length; i++) {
      // this.fieldsName?.forEach(value => {
        if (this.datefieldsName?.includes(this.fieldsName[i])) {
          let columnDef: ColumnDefinition = new ColumnDefinition();
          columnDef.fieldName = this.fieldsName[i];
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
          columnDef.fieldName = this.fieldsName[i];
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
          if (e.fieldName === 'id' || e.fieldName === 'finsurgeId' || e.fieldName === 'appmBank' || e.fieldName === 'appmNbr' || e.fieldName === 'appMrefer' || e.fieldName === 'appmPdtnbr' || e.fieldName === 'appmCri' || e.fieldName === 'initialStatus') {
            e.columnDisable = true;
            e.isExport = true;
            e.initialStatus = true;
          }
          if (e.fieldName === 'is_Duplicate' || e.fieldName === 'dupRejected') {
            e.isBoolean = true;
          }
        })
        // }
    }
    this.applicationColumns = this.listDynamicColumns
    this.getExtraColumns();
  }

  // Filter Dropdown function

  onApplyFilter(columnDetail: any) {
    this.defaultService.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
      columnDetail.column.dropDownList = res;
    })
    this.changeColumnData(columnDetail.column)
  }

  //Funtion to Filter

  changeColumnData(columnDefinition) {
    this.isView = false;
    this.applicationColumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.isView = false;
    this.applicationColumns = event;
    this.getShareDetailsData(this.pageData)
  }

  detailClick(clickEvent: ClickEvent) {

    // View Details
    if (clickEvent.col && clickEvent.col.displayName === 'View Details') {
      let fsIds = clickEvent.data.id;
      const dialogRef = this.dialog.open(ApplicationDetailPopupComponent, {
        width: '1400px', height: '850px', data: clickEvent.data.id
      });
    }

    // Preview Details
    if (clickEvent.col && clickEvent.col.displayName === 'View Result Status') {
      const dialogRef = this.dialog.open(ViewResultStatusComponent, {
        panelClass: 'view-details-panel',
        width: '150rem', height: '85rem', data: clickEvent.data.id
      });
    }

    // Duplicate Details
    if (clickEvent.col && clickEvent.col.displayName === 'Duplicate Preview') {
      let viewUrl = 'loan-application-matching/main-nav/duplicate-view';
      this.router.navigate([viewUrl], { queryParams: { fsId: clickEvent.data.finsurgeId } })
    }

    // Preview Details
    if (clickEvent.col && clickEvent.col.displayName === 'Document Preview') {
      const dialogRef = this.dialog.open(DocumentViewComponent, {
        width: '700px', height: '420px', data: clickEvent.data.id
      });
    }
  }
  

  // EXPORT FUNCTION 
  getDuplicateExportList(event: any) {
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
    anchor.download = `Configuration${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

}
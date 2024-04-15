import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { DownloadDataService, DownloadJob } from '../../users/services/download-data.service';
import { AuditBodies, AuditReports, AuditTrail, AuditTrailFilterSort, ExportFile, AuditTrailFilter, MultiSort } from '../models/AuditTrail';
import { AuditTrailService } from '../services/audit-trail.service';
import { AuditTrailViewComponent } from './audit-trail-view/audit-trail-view.component';
import { catchError, filter, Observable, of, Subscription, switchMap, timer } from 'rxjs';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ColumnDefinition, PageData } from 'src/app/c-los/models/clos-table';
@Component({
  selector: 'app-audit-trail-table',
  templateUrl: './audit-trail-table.component.html',
  styleUrls: ['./audit-trail-table.component.scss', '../../../../common-styles/table-style.scss']
})
export class AuditTrailTableComponent implements OnInit {

  panelOpenState: boolean;
  //pagnation
  totalPagess: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;
  pageEvent: PageEvent;
  module: any;
  moduleObject: any;
  auditTrail: AuditTrail[] = [];
  allGroups: AuditTrail[] = [];
  auditTrailHeaders: any[] = [];
  auditBodies: AuditTrail[] = []

  selectedModule: AuditTrail = null;
  selectedReport: string = null;
  auditReport: AuditReports = null;

  auditRepo: AuditReports[] = [];
  auditdata: AuditReports[] = [];
  auditHeaders: any;
  filterColumns: any[] = ["id", "module", "object", "action", "objectId", "user", "ipAddress", "lockResetFlag", "objectMessage", "userName", "objectName", "info1", "info2", "info3"];
  filterInput: any = null as any;
  loading: boolean = false;
  // New table implementation
  columns: ColumnDefinition[];
  items: AuditTrail[];
  pageData: PageData;
  loadingItems: boolean;
  file: any;
  dataRequest: ExportFile = { filter: new AuditTrailFilterSort(), columnDefinitions: [] };
  auditTrailFilter: AuditTrailFilter = new AuditTrailFilter(null, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any);
  // DOWNLOADS
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;
  filterByMultiSort: AuditTrailFilterSort = new AuditTrailFilterSort();
  multiSort: MultiSort[] = [];
  multiSorting: any = { name: '', filter: '', order: 'ASC' };





  constructor(
    private http: HttpClient,
    private auditTrailService: AuditTrailService,
    public dialog: MatDialog,
    public configurationService: ConfigurationService,
    private authenticationService: JwtAuthenticationService,
    private notifierService: NotifierService,
    public encryptDecryptService:EncryptDecryptService,
    private fileDownloadService: DownloadDataService,
    public ac: AccessControlData,
    public datepipe: DatePipe,
  ) {
    this.loadingItems = false; this.ac.items=this.encryptDecryptService.getACItemsFromSession()
    this.ac.super=this.encryptDecryptService.getACSuperFromSession()
    this.pageData = new PageData();
    this.pageData.pageSize = 50;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
   this.items = [];
    this.dataRequest.filter.filters = this.auditTrailFilter;
    this.dataRequest.filter.sort = [
      {
        orderBy: "id",
        sortingOrder: "asc",

      }
    ]
    this.columns = [
      {
        fieldName: "id",
        subFieldName: "",
        displayName: "ID",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""
      },
      {
        fieldName: "module",
        subFieldName: "",
        displayName: "Module",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""
      },
      {
        fieldName: "object",
        subFieldName: "",
        displayName: "Object",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""
      },
      {
        fieldName: "action",
        subFieldName: "",
        displayName: "Action",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""
      },

      {
        fieldName: "objectId",
        subFieldName: "",
        displayName: "ObjectID",
        lockColumn: false,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      {
        fieldName: "user",
        subFieldName: "",
        displayName: "User",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""


      },
      {
        fieldName: "ipAddress",
        subFieldName: "",
        displayName: "IP Address",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      {
        fieldName: "created",
        subFieldName: "",
        displayName: "Created",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      // {
      //   fieldName: "beforeValue",
      //   subFieldName: "",
      //   displayName: "BeforeValue",
      //   lockColumn: true,
      //   sortAsc: null,
      //   searchText: "",
      //   dateFormat: ""

      // },
      // {
      //   fieldName: "afterValue",
      //   subFieldName: "",
      //   displayName: "AfterValue",
      //   lockColumn: true,
      //   sortAsc: null,
      //   searchText: "",
      //   dateFormat: ""

      // },
      {
        fieldName: "lockResetFlag",
        subFieldName: "",
        displayName: "LockResetFlag",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      {
        fieldName: "objectName",
        subFieldName: "",
        displayName: "ObjectName",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      {
        fieldName: "objectType",
        subFieldName: "",
        displayName: "ObjectType",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      {
        fieldName: "objectMessage",
        subFieldName: "",
        displayName: "objectMessage",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      {
        fieldName: "info1",
        subFieldName: "",
        displayName: "Info1",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      {
        fieldName: "info2",
        subFieldName: "",
        displayName: "Info2",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
      {
        fieldName: "info3",
        subFieldName: "",
        displayName: "Info3",
        lockColumn: true,
        sortAsc: null,
        searchText: "",
        dateFormat: ""

      },
    ];
    this.dataRequest.columnDefinitions = this.columns;
  }


  ngOnInit(): void {
    this.getAudit();
   
  }
 
  getAuditList(pageNav?: PageEvent) {
    this.loading = true;
    this.auditHeaders = [];
    if (pageNav) {
      this.pageSize = pageNav.pageSize;
      this.pageNum = pageNav.pageIndex;
    }
    this.loading = true;
    // this.auditRepo = [];
    this.auditTrailService.getAuditList(this.pageNum + 1, this.pageSize, this.selectedModule.module, this.selectedReport).subscribe(
      (res) => {
        this.loading = false;
        this.auditTrail = res.data;
        this.entryCount = res.records;
        this.totalPagess = res.pages;
        if (this.auditdata.length > 0 && this.auditdata[0].module == this.selectedModule.module) {
          this.auditTrail = res.data;
          this.loading = false;
        }
        if (this.auditTrail.length > 0) {
          this.auditTrailHeaders = Object.keys(this.auditTrail[0]);
        }

        else {
          this.loading = false;
        }
       // this.showNotification('success', `Found ${this.entryCount} items.`);


      },
      err => {
        console.log(err);
        this.loading = false;
       // this.showNotification('error', 'Whoops! something went wrong.');

      }
    )
  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  selectReports(selectrepo: string, selectmodule: AuditTrail) {
    console.log(selectmodule.module)
    this.loading = true;
    this.selectedReport = selectrepo;
    this.selectedModule = selectmodule;
    this.loading = false
    this.getAuditList();
  }

  getAuditBodiesList(auditBodies: any) {
    console.log("auditBodies", auditBodies)
    const dialogRef = this.dialog.open(AuditTrailViewComponent, {
      height: '72vh',
      width: '60vw',
      data: auditBodies
    });
  }

  getSelectedModule(module: AuditTrail) {
    console.log("module", module)
    this.selectedModule = module
    return this.selectedModule;
  }

  getAudit() {
    this.auditTrailService.getAudit().subscribe(
      res => {
        console.log(this.allGroups);
        // this.loading = false;
        this.allGroups = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  // getAuditTrail(param) {
  //   if (Array.isArray(param)) {
  //     return "Array"
  //   }
  //   return param;
  // }

  getAuditTrail(param) {
    if (typeof (param) == 'object') {
      if (Array.isArray(param)) {
        if (param.length > 1) {
          let valueString = param[0].name + '(' + '+' + (param.length - 1) + 'others' + ')';
          return valueString;
        } else {
          if (param.length != 0) {
            return param[0].name;
          }
        }
        return "-";
      } else {
        if (param) {
          return param.name;
        }
        return "-";
      }
    } else {
      return param;
    }
  }

  createHeaderListByData(headers: any) {
    this.auditHeaders = [];
    headers.forEach(head => {
      let headerData = { name: head, filter: '', order: 'ASC' }
      this.auditHeaders.push(headerData);
    })
  }

  filterChangeEvent(name: any, filterInput: any) {
    this.filterColumns.forEach(filterColumn => {
      name = name.trim();
      if (filterColumn == name) {
        this.auditTrailFilter[`${name}`] = filterInput
      }
    })
  }



  onSortBtnClick(header) {
    this.getDuplicateElement(this.multiSort, header.name);
    this.multiSorting = header;
    if (this.multiSorting.order == 'ASC') {
      this.multiSorting.order = 'DESC'
    } else {
      this.multiSorting.order = 'ASC'
    }
    let sorting = new MultiSort();
    sorting.orderBy = this.multiSorting.name;
    sorting.sortingOrder = this.multiSorting.order;
    this.multiSort.push(sorting);
    console.log(this.multiSort);
    this.getAuditTrailByMultiSortFilter();
  }

  getDuplicateElement(multiSort, headerName) {
    let found: boolean;
    console.log(multiSort, headerName)
    for (var i = 0; i < multiSort.length; i++) {
      if (multiSort[i].orderBy == headerName) {
        found = true;
        console.log('Found Duplicate Element', i);
        this.multiSort.splice(i, 1);
        break;
      }
    }
  }

  getAuditTrailByMultiSortFilter() {
    if(this.auditTrail.length>0){
    this.filterByMultiSort.filters = this.auditTrailFilter;
    this.filterByMultiSort.sort = this.multiSort;
    console.log(this.filterByMultiSort);
    this.auditTrailService.getFiltersByMultiSort(this.filterByMultiSort, this.pageNum + 1, this.pageSize, this.selectedModule.module, this.selectedReport).subscribe(
      (res) => {
        if (res) {
          this.auditTrail = res.data;
          this.totalPagess = res.totalPages;
          this.entryCount = res.count;
          //this.showNotification('default', 'Loaded successfully.');
        }
      },
      (err) => {
        console.log(err);
       //this.showNotification('error', 'Whoops! something went wrong.');
      }
    )
  }}

  onClearBtnClick() {
    this.auditTrailFilter = new AuditTrailFilter(null, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any);
    this.multiSort = [];
    this.getAuditList();
  }

  onExportClick(fileFormat: string) {
    this.file = new ExportFile()
    this.auditTrailService.getExportFile(this.dataRequest, fileFormat, this.selectedModule.module, this.selectedReport).subscribe(
      (res) => {
        this.currentDownloadJob = res;
        if (this.downloadStatusSubscription) {
          this.downloadStatusSubscription.unsubscribe();
        }
        // let downloadIntervalSeconds: number = 1
        this.downloadStatusSubscription = timer(0, 2000)
          .pipe(
            switchMap(() => {
              return this.fileDownloadService.getJob(res.id)
                .pipe(catchError(err => {
                  // Handle errors
                  console.error(err);
                  return of(undefined);
                }));
            }),
            filter(data => data !== undefined)
          )
          .subscribe(data => {
            console.log('Updating download status.');
            this.currentDownloadJob = data;
            if (data.isReady) {
              this.downloadStatusSubscription.unsubscribe();
              this.currentDownloadJob = null;
              //Download file API
              this.auditTrailService.getFileByJob(res.id).subscribe(
                (response: any) => {
                  this.downloadFile(response, fileFormat);
                  this.notifierService.notify('success', 'Your download should start soon.');
                },
                err => {
                  this.notifierService.notify('error', 'Failed to download file. Refer console for more details.');
                  console.error(err);
                }
              )
            }
          });
      },
      (err) => {
        console.log(err);
        this.notifierService.notify('error', 'Failed to download file. Refer console for more details.');
      }
    )
  }

  downloadFile(res, format: string) {
    let data = [res];
    let date = new Date();
    let module = this.selectedModule.module;
    let moduleObj = this.selectedReport;
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
    anchor.download = `AUDIT_ITEMS _${module}_${moduleObj}.${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }


}





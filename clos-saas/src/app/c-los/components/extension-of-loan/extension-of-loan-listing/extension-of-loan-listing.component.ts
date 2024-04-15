import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ClickEvent, ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { ApplicationEntryPopupComponent } from '../../application-view/application-entry-popup/application-entry-popup.component';
import { ViewResultStatusComponent } from 'src/app/data-entry/initial-display/view-result-status/view-result-status.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { DownloadJob } from 'src/app/data-entry/services/download-service';
import { DatePipe } from '@angular/common';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { ExtensionOfLoanPopupComponent } from '../extension-of-loan-popup/extension-of-loan-popup.component';

@Component({
  selector: 'app-extension-of-loan-listing',
  templateUrl: './extension-of-loan-listing.component.html',
  styleUrls: ['./extension-of-loan-listing.component.scss']
})
export class ExtensionOfLoanListingComponent implements OnInit {

  activeTabIndex: number = 0;
  matTabHeader: any[] = [
    { name: 'Extension of Loan', icon: 'list' },
    // { name: 'Draft Application', icon: 'save' },
  ]
  selectedTabName: string = 'allApplications';
  selectedNavigation: string = 'EXTENSION_OF_LOAN';
  fieldsName: any[];
  displayName: any[];
  datefieldsName: any[];
  applicationLogData: any[];
  applicationColumns: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];
  extraColumns: ColumnDefinition[];
  pageData: PageData = new PageData();
  loadingItems: boolean;
  isView: boolean = true;
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;

  constructor(
    public encryptDecryptService: EncryptDecryptService,
    private closServices: CLosService,
    public dialog: MatDialog,
    private router: Router,
    public datepipe: DatePipe) {
    this.loadingItems = true;
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.pageData.count;
    this.applicationColumns = [];
    this.applicationLogData = [];
    if (this.activeTabIndex == 0) {
      this.selectedTabName = 'allApplications'
      this.selectedNavigation = 'EXTENSION_OF_LOAN';
    }
    // sessionStorage.removeItem('tabChange');
    // if (this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'))) {
    //   this.activeTabIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
    //   if (this.activeTabIndex == 0) {
    //     this.selectedTabName = 'allApplications'
    //     this.selectedNavigation = 'EXTENSION_OF_LOAN';
    //   }
    //   else if (this.activeTabIndex == 1) {
    //     this.selectedNavigation = 'DRAFT';
    //   }
    // }
  }

  ngOnInit(): void {
    this.getTableFieldsName();
  }

  getExtraColumns() {
    if (this.selectedNavigation == 'EXTENSION_OF_LOAN') {
      this.extraColumns = [
        {
          fieldName: "$extension_of_loan_view_details",
          displayName: "View Details",
          lockColumn: false,
          columnDisable: true,
          searchText: [],
          sortAsc: null,
          isExport: false,
          hideExport: true,
          filterDisable: true,
          viewSticky: false,
          inOrder: false,
        },
        {
          fieldName: "$extension_of_loan_document_preview",
          displayName: "Document Preview",
          lockColumn: false,
          columnDisable: true,
          searchText: [],
          sortAsc: null,
          isExport: false,
          hideExport: true,
          filterDisable: true,
          viewSticky: false,
          inOrder: false,
        },
           {
          fieldName: "$extension_parent_details",
          displayName: "Original Details",
          lockColumn: false,
          columnDisable: true,
          searchText: [],
          sortAsc: null,
          isExport: false,
          hideExport: true,
          filterDisable: true,
          viewSticky: false,
          inOrder: false,
        },
        // {
        //   fieldName: "$extension_of_loan_details",
        //   displayName: "Extension of Loan Details",
        //   lockColumn: false,
        //   columnDisable: true,
        //   searchText: [],
        //   sortAsc: null,
        //   isExport: false,
        //   hideExport: true,
        //   filterDisable: true,
        //   viewSticky: false,
        //   inOrder: false,
        // }, 
        {
          fieldName: "extension_of_loan_details_view",
          displayName: "View Extension of Loan Details",
          lockColumn: false,
          columnDisable: true,
          searchText: [],
          sortAsc: null,
          isExport: true,
          hideExport: false,
          filterDisable: false,
          viewSticky: false,
          inOrder: false,
        },
      ];
      for (let columData of this.extraColumns) {
        if (columData.inOrder === true) {
          this.applicationColumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.applicationColumns.push(columData)
        }
      }
      this.getShareDetailsData(this.pageData);
    }
    else {
      this.extraColumns = [
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
          viewSticky: false,
          inOrder: false,
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
          viewSticky: false,
          inOrder: false,
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
          viewSticky: false,
          inOrder: false,
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
          viewSticky: false,
          inOrder: false,
        },
        {
          fieldName: "$edit_application",
          displayName: "Edit",
          lockColumn: false,
          columnDisable: true,
          searchText: [],
          sortAsc: null,
          isExport: true,
          hideExport: false,
          filterDisable: false,
          viewSticky: false,
          inOrder: false,
        },
      ];
      for (let columData of this.extraColumns) {
        if (columData.inOrder === true) {
          this.applicationColumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.applicationColumns.push(columData)
        }
      }
      this.getShareDetailsData(this.pageData);
    }
  }

  appVerificationTabChange(event: any) {
    sessionStorage.setItem('tabChange', this.encryptDecryptService.encryptData(event.tab.textLabel));
    localStorage.setItem('activeTab', this.encryptDecryptService.encryptData(event.index));
    if (event.index == 0) {
      this.selectedNavigation = 'EXTENSION_OF_LOAN';
      this.selectedTabName = 'allApplications'
      this.listDynamicColumns = []
      this.applicationColumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 1) {
      this.selectedNavigation = 'DRAFT';
      this.listDynamicColumns = []
      this.applicationColumns = [];
      this.dynamicColumndefinitions();
    }
    // else if (event.index == 2) {
    //   this.selectedNavigation = 'PENDING';
    //   this.listDynamicColumns = []
    //   this.applicationColumns = [];
    //   this.dynamicColumndefinitions();
    // }
  }
  //DYNAMIC COLUMN DEFINITION CREATION
  dynamicColumndefinitions() {
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
        if (this.displayName[i] !== 'STATUS' && this.displayName[i] !== 'applicationResult') {
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
          if (e.fieldName === 'id' || e.fieldName === 'applicantName' || e.fieldName === 'entityName' || e.fieldName === 'mail_id' || e.fieldName === 'typesOfLoan' || e.fieldName === 'share' || e.fieldName === 'nationality' || e.fieldName === 'designation') {
            e.columnDisable = true;
            e.isExport = true;
            e.initialStatus = true;
          }
          if (e.fieldName === 'is_Duplicate' || e.fieldName === 'dupRejected') {
            e.isBoolean = true;
          }
          if (e.displayName === 'STATUS') {
            e.hideExport = true;
          }
          if (e.displayName === 'applicationResult') {
            e.hideExport = true;
          }
        })
      }
      // }
    }
    this.applicationColumns = this.listDynamicColumns;
    this.getExtraColumns();
  }

  //LISTING FUNCTION
  getShareDetailsData(pageData: PageData) {
    this.loadingItems = true;
    this.closServices.getApplicationList(this.applicationColumns, pageData.currentPage, pageData.pageSize, this.isView, this.selectedNavigation).subscribe(res => {
      console.log("res", res);
      this.loadingItems = false;
      this.applicationLogData = res['data']
      this.pageData.count = res['count']
      this.pageData.totalPages = res['TotalRecords'];
    })
  }

  // GET  TABLE FIELDS 
  getTableFieldsName() {
    this.closServices.getApplicationFeildList().subscribe(res => {
      this.fieldsName = res['fieldName'];
      this.displayName = res['displayName'];
      this.dynamicColumndefinitions()
    })
  }

  // Filter Dropdown function
  onApplyFilter(columnDetail: any) {
    this.closServices.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
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
      const dialogRef = this.dialog.open(ApplicationEntryPopupComponent, {
        width: '1400px', height: '850px', data: clickEvent.data.id
      });
    }

    // Preview Details
    // if (clickEvent.col && clickEvent.col.displayName === 'View Result Status') {
    //   const dialogRef = this.dialog.open(ViewResultStatusComponent, {
    //     panelClass: 'view-details-panel',
    //     width: '150rem', height: '85rem', data: clickEvent.data.id
    //   });
    // }

    // Duplicate Details
    // if (clickEvent.col && clickEvent.col.displayName === 'Duplicate Preview') {
    //   let viewUrl = 'loan-application-matching/main-nav/duplicate-view';
    //   this.router.navigate([viewUrl], { queryParams: { fsId: clickEvent.data.finsurgeId } })
    // }

    // Preview Details
    if (clickEvent.col && clickEvent.col.displayName === 'Document Preview') {
      const dialogRef = this.dialog.open(DocumentViewComponent, {
        width: '700px', height: '420px', data: clickEvent.data.id
      });
    }
    // Edit button Click
    // if (clickEvent.col && clickEvent.col.displayName === 'Edit') {
    //   let data = clickEvent.data;
    //   let encryptID = this.encryptDecryptService.encryptData((data.id).toString())
    //   sessionStorage.setItem('appId', encryptID)
    //   this.router.navigate(['/application-entry','application-details']) 
    // }
    //Extension of loan button Click
    if (clickEvent.col && clickEvent.col.displayName === 'Extension of Loan Details') {
      let fsIds = clickEvent.data.id;
      let buttonName = clickEvent.col.displayName;
      const dialogRef = this.dialog.open(ExtensionOfLoanPopupComponent, {
        width: '115rem', height: '80rem', data: { fsIds: clickEvent.data.id, buttonName: clickEvent.col.displayName }
      });
    }
    // View Extension of loan button Click
    if (clickEvent.col && clickEvent.col.displayName === 'View Extension of Loan Details') {
      let fsIds = clickEvent.data.id;
      let buttonName = clickEvent.col.displayName;
      const dialogRef = this.dialog.open(ExtensionOfLoanPopupComponent, {
        width: '115rem', height: '80rem', data: { fsIds: clickEvent.data.id, buttonName: clickEvent.col.displayName }
      });
    }
      // Original details click
      if (clickEvent.col && clickEvent.col.displayName === 'Original Details') {
         let fsIds = clickEvent.data.parentId;
         console.log(fsIds)
        const dialogRef = this.dialog.open(ApplicationEntryPopupComponent, {
          width: '1400px', height: '850px', data: clickEvent.data.parentId
        });
      }
  }

  // EXPORT FUNCTION 
  getApplicationExportList(event: any) {
    this.closServices.getApplicationExport(event.columns, event.format).subscribe(res => {
      this.currentDownloadJob = res;
      if (this.downloadStatusSubscription) {
        this.downloadStatusSubscription.unsubscribe();
      }
      this.downloadStatusSubscription = timer(0, 2000)
        .pipe(
          switchMap(() => {
            return this.closServices.getJob(res.id)
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
            this.closServices.getFileByJob(res.id).subscribe(
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
    anchor.download = `Application_Listing${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

}

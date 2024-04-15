import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { ClosCaseManagerService } from 'src/app/loan-case-manager/service/clos-case-manager.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { DepositerbaseViewdetailsPopupComponent } from '../../depositerbase-viewdetails-popup/depositerbase-viewdetails-popup.component';
import { DuplicatePreviewMultirowComponent } from '../../duplicate-preview-multirow/duplicate-preview-multirow.component';
import { SelfClaimComponent } from '../../self-claim/self-claim.component';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { DownloadJob } from 'src/app/data-entry/services/download-service';


@Component({
  selector: 'app-document-verification',
  templateUrl: './document-verification.component.html',
  styleUrls: ['./document-verification.component.scss']
})
export class DocumentVerificationComponent implements OnInit {
  selectedIndex: number = 0;
  singleFinsurgeId:any;
  selectedTabName: string = 'verificationQueue';
  extraColumns: ColumnDefinition[] = [];
  applicationVerificationTabs: any[] = [
    { name: 'Verification Queue', icon: 'list' },
    { name: 'Verification In Progress', icon: 'refresh' },
    { name: 'Pending Info', icon: 'assignment' },
    { name: 'Accept', icon: 'check' },
    { name: 'Reject', icon: 'close' },
  ]
  loadingItems: boolean;
  pageData: PageData = new PageData();
  docVerificatincolumns: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];
  fieldsName: any[];
  displayName: any[];
  datefieldsName:any[];
  docVerificationData:any[];
  isView: boolean = true;
  finsurgeIds:any[]= [];
  buttonCondition:boolean = false;
  selectedNavigation: string = 'DOCUMENT_VERIFIER_QUEUE';
  loanType: string = '';

  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;

  constructor(
    public dialog: MatDialog,
    private defaultService: ClosCaseManagerService,
    public datepipe: DatePipe,
    public closService:CLosService,
    public encryptDecryptService: EncryptDecryptService
  ) {
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.docVerificatincolumns=[];
    this.docVerificationData=[];
    this.defaultService.getData().subscribe((data) => {
      this.loanType = data?.data;
      this.getTableFieldsName();
    });
    if (this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'))) {
      this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
      if (this.selectedIndex == 0) {
        this.selectedTabName = 'verificationQueue';
        this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      }
      else if (this.selectedIndex == 1) {
        this.selectedTabName = 'verificationInProgress';
        this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      }
      else if (this.selectedIndex == 2) {
        this.selectedTabName = 'PENDING';
        this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      }
      else if (this.selectedIndex == 3) {
        this.selectedTabName = 'APPROVE_DOCUMENT';
        this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      }
      else if (this.selectedIndex == 4) {
        this.selectedTabName = 'REJECT_DOCUMENT';
        this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      }
    }
  }

  ngOnInit(): void {
    this.getTableFieldsName();
  }
  getExtraColumns() {
    if (this.selectedTabName === 'verificationQueue' && this.selectedNavigation === 'DOCUMENT_VERIFIER_QUEUE') {
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
          fieldName: "$view_details_internalscoring",
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
          fieldName: "$document_preview_internalscoring",
          displayName: "Document Preview",
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
          fieldName: "$selfAssign",
          displayName: "Self Assign",
          lockColumn: false,
          columnDisable: true,
          searchText: [],
          sortAsc: null,
          isExport: false,
          hideExport: true,
          filterDisable: true,
          inOrder: false,
        }
      ];
      for (let columData of this.extraColumns) {
        if (columData.inOrder === true) {
          this.docVerificatincolumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.docVerificatincolumns.push(columData)
        }
      }
      this.getDocVerificationData(this.pageData);

    }
    else if(this.selectedIndex == 1 || this.selectedIndex == 2 || this.selectedIndex == 3 ) {
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
          fieldName: "$view_details_internalscoring_other",
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
          fieldName: "$document_preview_internalscoring_other",
          displayName: "Document Preview",
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
          fieldName: "$duplicate_preview",
          displayName: "Internal Kyc Preview",
          lockColumn: false,
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
          this.docVerificatincolumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.docVerificatincolumns.push(columData)
        }
      }
      this.getDocVerificationData(this.pageData);
    }
    else if(this.selectedIndex == 4 ) {
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
          fieldName: "$view_details_reject_other",
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
          fieldName: "$document_preview_reject_other",
          displayName: "Document Preview",
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
          fieldName: "reasonForRejection",
          displayName: "Reason for Rejection",
          lockColumn: false,
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
          this.docVerificatincolumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.docVerificatincolumns.push(columData)
        }
      }
      this.getDocVerificationData(this.pageData);
    }
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
        if (e.fieldName === 'id' || e.fieldName === 'businessRegistration'|| e.fieldName === 'photoCopyOfNRIC' || e.fieldName === 'latest3YearsManagementAccounts'|| e.fieldName === 'latest_6Months_BankStatements' || e.fieldName === 'latest_3Years_IncomeTaxReturns'
        || e.fieldName === 'projectProposal'|| e.fieldName === 'greenCertification' || e.fieldName === 'smeIndustry'|| e.fieldName === 'KYCofApplicant' || e.fieldName === 'KYCofDirector') {
          e.columnDisable = true;
          e.isExport = true;
        }
        if (e.fieldName === 'is_Duplicate' || e.fieldName === 'dupRejected') {
          e.isBoolean = true;
        }
      })
      // }
    }
    this.docVerificatincolumns = this.listDynamicColumns
    this.getExtraColumns();
  }

  multiCheckData(event: any) {
    this.finsurgeIds = event;

  }
   //multicheck Duplicate Preview
   multiCheckDuplicatePreview(event: any) {
    console.log("multiCheckDuplicatePreview", this.finsurgeIds);
    this.buttonCondition = true;
    const dialogRef = this.dialog.open(DuplicatePreviewMultirowComponent, {
      height: '85rem',
      width: '130rem',
      data: {
        popupData: this.docVerificatincolumns, popupId: this.finsurgeIds, status: this.selectedTabName,selectedNavigation:this.selectedNavigation,
        buttonSelectAll: this.buttonCondition,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.selectedIndex = result;
      this.getDocVerificationData(this.pageData);
    });
  }

  // GET  TABLE FIELDS 
  getTableFieldsName() {

    this.defaultService.getFieldsName().subscribe(res => {
      this.fieldsName = res['fieldName'];
      this.displayName = res['displayName'];
      this.dynamicColumndefinitions();
    })
  }

  //LISTING FUNCTION
  getDocVerificationData(pageData: PageData) {
    this.loadingItems = true;
    this.defaultService.getList(this.docVerificatincolumns, pageData.currentPage, pageData.pageSize, this.selectedTabName, this.isView, this.selectedNavigation,this.loanType).subscribe(res => {
      this.loadingItems = false;
      this.docVerificationData = res['data'];
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }

  // TAB CHANGE FUNCTIONS
  appVerificationTabChange(event: any) {
    sessionStorage.setItem('tabChange', this.encryptDecryptService.encryptData(event.tab.textLabel));
    localStorage.setItem('activeTab', this.encryptDecryptService.encryptData(event.index));
    if (event.index == 0) {
      this.selectedTabName = 'verificationQueue';
      this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      this.listDynamicColumns = []
      this.docVerificatincolumns = [];
      this.dynamicColumndefinitions();

    }
    else if (event.index == 1) {
      this.selectedTabName = 'verificationInProgress';
      this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      this.listDynamicColumns = []
      this.docVerificatincolumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 2) {
      this.selectedTabName = 'PENDING';
      this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      this.listDynamicColumns = []
      this.docVerificatincolumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 3) {
      this.selectedTabName = 'APPROVE_DOCUMENT';
      this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      this.listDynamicColumns = []
      this.docVerificatincolumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 4) {
      this.selectedTabName = 'REJECT_DOCUMENT';
      this.selectedNavigation = 'DOCUMENT_VERIFIER_QUEUE';
      this.listDynamicColumns = []
      this.docVerificatincolumns = [];
      this.dynamicColumndefinitions();
    }
  }

  //  FILTER DROP DOWN FUNCTION 
  onApplyFilter(columnDetail: any) {
    // this.defaultService.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
    //   columnDetail.column.dropDownList = res;
    // })
    this.changeColumnData(columnDetail.column)
  }

  // FILTER  FUNCTIONS
  changeColumnData(columnDefinition) {
    this.isView = false;
    this.docVerificatincolumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.isView = false;
    this.docVerificatincolumns = event;
    this.getDocVerificationData(this.pageData);
  }

  //BUTTON CLICK FUNCTION
  detailClick(event: any) {
    if (event.col && event.col.displayName === 'View Details') {
      console.log("event click", event.data.id)
      const dialogRef = this.dialog.open(DepositerbaseViewdetailsPopupComponent, {
        width: '1400px', height: '850px', data: event.data.id
      });
    }

    // Preview Details
    if (event.col && event.col.displayName === 'Document Preview') {
      const dialogRef = this.dialog.open(DocumentViewComponent, {
        width: '700px', height: '420px', data: event.data.id
      });
    }

    if (event.col && event.col.fieldName === '$duplicate_preview') {
      if (!this.singleFinsurgeId.includes(event.data.id)) {
        this.singleFinsurgeId[0] = event.data.id;
      }
      console.log(this.singleFinsurgeId)
      const dialogRef = this.dialog.open(DuplicatePreviewMultirowComponent, {
        height: '85rem',
        width: '130rem',

        data: {
          popupData: this.docVerificatincolumns, popupId: this.singleFinsurgeId, status: this.selectedTabName, selectedNavigation: this.selectedNavigation
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
      });
    }
    this.singleFinsurgeId = this.singleFinsurgeId || [];
    // SELFASSIGN  POPUP
    if (event.col && event.col.fieldName === '$selfAssign') {
      if (!this.singleFinsurgeId.includes(event.data.id)) {
        this.singleFinsurgeId[0] = event.data.id;
      }
      console.log(this.singleFinsurgeId)
      const dialogRef = this.dialog.open(SelfClaimComponent, {
        width: '25vw',
        height: '30vh',
        data: {
          popupData: this.docVerificatincolumns, popupId: this.singleFinsurgeId, status: this.selectedTabName
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        //this.dynamicColumndefinitions();
        this.selectedIndex = result;
        console.log('tabIndex', this.selectedIndex);

      });
    }
  }

  handleSelectAllSelfAssign(selectedIds: number[]) {
    
    this.singleFinsurgeId = this.singleFinsurgeId || [];
    this.singleFinsurgeId = selectedIds.slice();
    
    console.log(this.singleFinsurgeId);

    if (this.singleFinsurgeId.length > 0) {
      const dialogRef = this.dialog.open(SelfClaimComponent, {
        width: '25vw',
        height: '30vh',
        data: {
          popupData: this.docVerificatincolumns,
          popupId: this.singleFinsurgeId,
          status: this.selectedTabName
        }
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
        console.log('tabIndex', this.selectedIndex);
        });
    }
  }


   // EXPORT FUNCTION 
   docVerificationExport(event: any,loanType: string) {
    this.defaultService.appVerificationExport(event.columns, event.format, this.selectedTabName,this.selectedNavigation,loanType).subscribe(res => {
      this.currentDownloadJob = res;
      if (this.downloadStatusSubscription) {
        this.downloadStatusSubscription.unsubscribe();
      }
      this.downloadStatusSubscription = timer(0, 2000)
        .pipe(
          switchMap(() => {
            return this.closService.getJob(res.id)
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
            this.closService.getFileByJob(res.id).subscribe(
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
    anchor.download = `Document_Verification${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

  ngOnDestroy() {
    localStorage.removeItem('activeTab')
  }

}

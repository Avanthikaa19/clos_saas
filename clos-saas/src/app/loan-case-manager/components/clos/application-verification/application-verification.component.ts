import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { ApplicationEntryPopupComponent } from 'src/app/c-los/components/application-view/application-entry-popup/application-entry-popup.component';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { ClosCaseManagerService } from 'src/app/loan-case-manager/service/clos-case-manager.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { DownloadJob } from 'src/app/data-entry/services/download-service';
import { DuplicatePreviewMultirowComponent } from '../../duplicate-preview-multirow/duplicate-preview-multirow.component';
import { SelfClaimComponent } from '../../self-claim/self-claim.component';
import { KycPreviewComponent } from './kyc-preview/kyc-preview.component';

@Component({
  selector: 'app-application-verification',
  templateUrl: './application-verification.component.html',
  styleUrls: ['./application-verification.component.scss']
})
export class ApplicationVerificationComponent implements OnInit {
  selectedIndex: number = 0;
  selectedTabName: string = 'verificationQueue';
  extraColumns: ColumnDefinition[] = [];
  singleFinsurgeId: any;
  applicationVerificationTabs: any[] = [
    { name: 'Verification Queue', icon: 'list' },
    { name: 'Verification In Progress', icon: 'refresh' },
    { name: 'Pending Application', icon: 'assignment' },
    { name: 'Accept Application', icon: 'check' },
    { name: 'Reject Application', icon: 'close' },
  ]
  loadingItems: boolean;
  pageData: PageData = new PageData();
  appVerificatincolumns: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];
  fieldsName: any[];
  displayName: any[];
  datefieldsName: any[];
  appVerificationData: any[];
  isView: boolean = true;
  buttonCondition: boolean = false;
  finsurgeIds: any[] = [];
  selectedNavigation: string = 'KYC_COMPLETED';
  loanType:string ='';

  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;

  constructor(
    public dialog: MatDialog,
    private defaultService: ClosCaseManagerService,
    private closService: CLosService,
    public datepipe: DatePipe,
    public encryptDecryptService: EncryptDecryptService
  ) {
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.appVerificatincolumns = [];
    this.appVerificationData = [];
    this.defaultService.getData().subscribe((data) => {
      this.loanType = data?.data;
      this.getTableFieldsName();
    });
    sessionStorage.removeItem('tabChange');
    if (this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'))) {
      this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
      if (this.selectedIndex == 0) {
        this.selectedTabName = 'verificationQueue';
        this.selectedNavigation = 'KYC_COMPLETED';
      }
      else if (this.selectedIndex == 1) {
        this.selectedTabName = 'verificationInProgress';
        this.selectedNavigation = 'KYC_COMPLETED';
      }
      else if (this.selectedIndex == 2) {
        this.selectedTabName = 'PENDING';
        this.selectedNavigation = 'KYC_COMPLETED';
      }
      else if (this.selectedIndex == 3) {
        this.selectedTabName = 'verificationQueue';
        this.selectedNavigation = 'KYC_APPROVED'
      }
      else if (this.selectedIndex == 4) {
        this.selectedTabName = 'REJECT_APPLICATION';
        this.selectedNavigation = 'KYC_COMPLETED'
      }
    }
  }

  ngOnInit(): void {
    this.getTableFieldsName();
  }
  getExtraColumns() {
    if (this.selectedTabName === 'verificationQueue' && this.selectedNavigation === 'KYC_COMPLETED') {
      this.extraColumns = [
        // {
        //   fieldName: "_checkbox",
        //   displayName: "",
        //   lockColumn: false,
        //   columnDisable: true,
        //   searchText: [],
        //   sortAsc: null,
        //   isExport: false,
        //   hideExport: true,
        //   filterDisable: true,
        //   inOrder: true,
        // },
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
          fieldName: "$duplicate_preview",
          displayName: "Kyc Preview",
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
          this.appVerificatincolumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.appVerificatincolumns.push(columData)
        }
      }
      this.getAppVerificationData(this.pageData);
    }
    else if(this.selectedIndex == 1 || this.selectedIndex == 2 || this.selectedIndex == 3 ) {
      this.extraColumns = [
        // {
        //   fieldName: "_checkbox",
        //   displayName: "",
        //   lockColumn: false,
        //   columnDisable: true,
        //   searchText: [],
        //   sortAsc: null,
        //   isExport: false,
        //   hideExport: true,
        //   filterDisable: true,
        //   inOrder: true,
        // },
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
          displayName: "Kyc Preview",
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
          this.appVerificatincolumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.appVerificatincolumns.push(columData)
        }
      }
      this.getAppVerificationData(this.pageData);
    }
    else if(this.selectedIndex == 4 ) {
      this.extraColumns = [
        // {
        //   fieldName: "_checkbox",
        //   displayName: "",
        //   lockColumn: false,
        //   columnDisable: true,
        //   searchText: [],
        //   sortAsc: null,
        //   isExport: false,
        //   hideExport: true,
        //   filterDisable: true,
        //   inOrder: true,
        // },
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
          fieldName: "$duplicate_preview_reject_other",
          displayName: "Kyc Preview",
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
          fieldName: "applicationResult",
          subFieldName: "reasonForRejection",
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
          this.appVerificatincolumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.appVerificatincolumns.push(columData)
        }
      }
      this.getAppVerificationData(this.pageData);
    }
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
        if (e.fieldName === 'id' || e.fieldName === 'applicantName' || e.fieldName === 'entityName' || e.fieldName === 'designation' || e.fieldName === 'company_id'|| e.fieldName === 'homeAddress'|| e.fieldName === 'officeAddress'|| e.fieldName === 'share'|| e.fieldName === 'legalNameOfTheCompany'|| e.fieldName === 'typeofBusiness'|| e.fieldName === 'dateOfIncorporation'|| e.fieldName === 'annualTurnover') {
          e.columnDisable = true;
          e.isExport = true;
        }
        if (e.fieldName === 'is_Duplicate' || e.fieldName === 'dupRejected') {
          e.isBoolean = true;
        }
      })
      // }
    }
    this.appVerificatincolumns = this.listDynamicColumns
    this.getExtraColumns();
  }
  // GET  TABLE FIELDS 
  getTableFieldsName() {
    this.defaultService.getFieldsName().subscribe(res => {
      this.fieldsName = res['fieldName'];
      this.displayName = res['displayName'];
      this.dynamicColumndefinitions();
    })
  }
  multiCheckData(event: any) {
    this.finsurgeIds = event;

  }
  //multicheck Duplicate Preview
  multiCheckDuplicatePreview(event: any) {
    this.buttonCondition = true;
    const dialogRef = this.dialog.open(KycPreviewComponent, {
      height: '75rem',
      width: '130rem',
      data: {
        popupData: this.appVerificatincolumns, popupId: this.finsurgeIds, status: this.selectedTabName, selectedNavigation: this.selectedNavigation,
        buttonSelectAll: this.buttonCondition,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.selectedIndex = result;
      this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
      if(this.selectedTabName = 'verificationInProgress'){
        this.selectedIndex == 1;
      }
      this.getAppVerificationData(this.pageData);
    });
  }

  //LISTING FUNCTION
  getAppVerificationData(pageData: PageData) {
    this.loadingItems = true;
    this.defaultService.getList(this.appVerificatincolumns, pageData.currentPage, pageData.pageSize, this.selectedTabName, this.isView, this.selectedNavigation,this.loanType).subscribe(res => {
      this.loadingItems = false;
      this.appVerificationData = res['data'];
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
      this.selectedNavigation = 'KYC_COMPLETED';
      this.listDynamicColumns = []
      this.appVerificatincolumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 1) {
      this.selectedTabName = 'verificationInProgress';
      this.selectedNavigation = 'KYC_COMPLETED';
      this.listDynamicColumns = []
      this.appVerificatincolumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 2) {
      this.selectedTabName = 'PENDING';
      this.selectedNavigation = 'KYC_COMPLETED';
      this.listDynamicColumns = []
      this.appVerificatincolumns = [];
      this.dynamicColumndefinitions();
     
    }
    else if (event.index == 3) {
      this.selectedTabName = 'verificationQueue';
      this.selectedNavigation = 'KYC_APPROVED'
      this.listDynamicColumns = []
      this.appVerificatincolumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 4) {
      this.selectedTabName = 'REJECT_APPLICATION';
      this.selectedNavigation = 'KYC_COMPLETED'
      this.listDynamicColumns = []
      this.appVerificatincolumns = [];
      this.dynamicColumndefinitions();
    }
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
    this.isView = false;
    this.appVerificatincolumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.isView = false;
    this.appVerificatincolumns = event;
    this.getAppVerificationData(this.pageData);
  }

  detailClick(event: any) {
    if (event.col && event.col.displayName === 'View Details') {
      const dialogRef = this.dialog.open(ApplicationEntryPopupComponent, {
        width: '1400px', height: '850px', data: event.data.id
      });
    }

    // Preview Details
    if (event.col && event.col.displayName === 'Document Preview') {
      const dialogRef = this.dialog.open(DocumentViewComponent, {
        width: '700px', height: '420px', data: event.data.id
      });
    }
    this.singleFinsurgeId = this.singleFinsurgeId || [];
    if (event.col && event.col.fieldName === '$duplicate_preview' || event.col.fieldName === '$duplicate_preview_reject_other') {
      if (!this.singleFinsurgeId.includes(event.data.id)) {
        this.singleFinsurgeId[0] = event.data.id;
      }
      const dialogRef = this.dialog.open(KycPreviewComponent, {
        height: '79rem',
        width: '130rem',
        data: {
          popupData: this.appVerificatincolumns, popupId: this.singleFinsurgeId, status: this.selectedTabName, selectedNavigation: this.selectedNavigation,seletedTab :this.selectedIndex }
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
        this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
        if(this.selectedTabName = 'verificationInProgress'){
          this.selectedIndex == 1;
        }
      });
    }
    this.singleFinsurgeId = this.singleFinsurgeId || [];
    // SELFASSIGN  POPUP
    if (event.col && event.col.fieldName === '$selfAssign') {
      if (!this.singleFinsurgeId.includes(event.data.id)) {
        this.singleFinsurgeId[0] = event.data.id;
      }
      const dialogRef = this.dialog.open(SelfClaimComponent, {
        width: '25vw',
        height: '30vh',
        data: {
          popupData: this.appVerificatincolumns, popupId: this.singleFinsurgeId, status: this.selectedTabName
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        //this.dynamicColumndefinitions();
        this.selectedIndex = result;
      });
    }
  }

  handleSelectAllSelfAssign(selectedIds: number[]) {
    this.singleFinsurgeId = this.singleFinsurgeId || [];
    this.singleFinsurgeId = selectedIds.slice();
    if (this.singleFinsurgeId.length > 0) {
      const dialogRef = this.dialog.open(SelfClaimComponent, {
        width: '25vw',
        height: '30vh',
        data: {
          popupData: this.appVerificatincolumns,
          popupId: this.singleFinsurgeId,
          status: this.selectedTabName
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
      });
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('activeTab')
  }

  // EXPORT FUNCTION 
  appVerificationExport(event: any,loanType: string) {
    this.defaultService.appVerificationExport(event.columns, event.format, this.selectedTabName, this.selectedNavigation,loanType).subscribe(res => {
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
    anchor.download = `Application_Verification${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

}

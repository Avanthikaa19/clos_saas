import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { DownloadJob } from 'src/app/data-entry/services/download-service';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { ClosCaseManagerService } from 'src/app/loan-case-manager/service/clos-case-manager.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { DepositerbaseViewdetailsPopupComponent } from '../../depositerbase-viewdetails-popup/depositerbase-viewdetails-popup.component';
import { DuplicatePreviewMultirowComponent } from '../../duplicate-preview-multirow/duplicate-preview-multirow.component';
import { SelfClaimComponent } from '../../self-claim/self-claim.component';
import { UnderwritingPreviewPopupComponent } from '../underwriting-preview-popup/underwriting-preview-popup.component';
import { CreditMemoPopupComponent } from '../credit-memo-popup/credit-memo-popup.component';
import { RatioPreviewPopupComponent } from '../ratio-preview-popup/ratio-preview-popup.component';

@Component({
  selector: 'app-underwriting',
  templateUrl: './underwriting.component.html',
  styleUrls: ['./underwriting.component.scss']
})
export class UnderwritingComponent implements OnInit {
  selectedIndex: number = 0;
  singleFinsurgeId: any;
  underWritingTabs: any[] = [
    { name: 'Underwriting Queue', icon: 'list' },
    { name: 'Accept Application', icon: 'check' },
    { name: 'Reject Application', icon: 'close' },
  ]
  loadingItems: boolean;
  pageData: PageData = new PageData();
  underwritingColumns: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];
  fieldsName: any[];
  displayName: any[];
  datefieldsName: any[];
  underwritingData: any[];
  isView: boolean = true;
  selectedTabName: string = 'verificationQueue';
  selectedNavigation: string = 'UNDERWRITING_QUEUE';
  finsurgeIds: any[] = [];
  buttonCondition: boolean = false;
  extraColumns: ColumnDefinition[] = [];
  loanType: string = '';
  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;

  constructor(
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public encryptDecryptService: EncryptDecryptService,
    public closService: ClosCaseManagerService,
    public exportservice: CLosService,
  ) {
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.underwritingColumns = [];
    this.underwritingData = [];
    sessionStorage.removeItem('tabChange');
    this.closService.getData().subscribe((data) => {
      this.loanType = data?.data;
      this.getTableFieldsName();
    });
    if (this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'))) {
      this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
      if (this.selectedIndex == 0) {
        this.selectedTabName = 'verificationQueue';
        this.selectedNavigation = 'UNDERWRITING_QUEUE';
      }
      else if (this.selectedIndex == 1) {
        this.selectedTabName = 'verificationQueue';
        this.selectedNavigation = 'LOAN_APPROVAL_QUEUE';
      }
      else if (this.selectedIndex == 2) {
        this.selectedTabName = 'REJECT_UNDERWRITE';
        this.selectedNavigation = 'UNDERWRITING_REJECT';
      }
    }
  }

  ngOnInit(): void {
    this.getTableFieldsName();
  }

  getExtraColumns() {
    if (this.selectedTabName === 'verificationQueue' && this.selectedNavigation === 'UNDERWRITING_QUEUE') {
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
          fieldName: "$ratioPreview",
          displayName: "Ratio Preview",
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
          fieldName: "$creditMemo",
          displayName: "Credit Memo",
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
          fieldName: "$underwritingPreview",
          displayName: "Underwriting Preview",
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
          this.underwritingColumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.underwritingColumns.push(columData)
        }
      }
      this.getAppVerificationData(this.pageData);

    }
    else if (this.selectedIndex == 1 || this.selectedIndex == 2) {
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
      ];
      for (let columData of this.extraColumns) {
        if (columData.inOrder === true) {
          this.underwritingColumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.underwritingColumns.push(columData)
        }
      }
      this.getAppVerificationData(this.pageData);
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
        if (e.fieldName === 'id' || e.fieldName === 'collateralAmount' || e.fieldName === 'collateralAsset' || e.fieldName === 'collateralCurrency' || e.fieldName === 'collateralValue' || e.fieldName === 'marketValue' || e.fieldName === 'loanToValueRatio' || e.fieldName === 'liquidityCurrentRatio' || e.fieldName === 'liquidityQuickRatio' || e.fieldName === 'liquidityQuickRatio' || e.fieldName === 'interestCoverageRatio' || e.fieldName === 'debtServiceChargeCoverageRatio' || e.fieldName === 'fixedChargeCoverageRatio' || e.fieldName === 'longTermDebtToEquityRatio') {
          e.columnDisable = true;
          e.isExport = true;
        }
        if (e.fieldName === 'is_Duplicate' || e.fieldName === 'dupRejected') {
          e.isBoolean = true;
        }
      })
      // }
    }
    this.underwritingColumns = this.listDynamicColumns
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
        popupData: this.underwritingColumns, popupId: this.finsurgeIds, status: this.selectedTabName, selectedNavigation: this.selectedNavigation,
        buttonSelectAll: this.buttonCondition,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.selectedIndex = result;
      this.getAppVerificationData(this.pageData);
    });
  }

  // GET  TABLE FIELDS 
  getTableFieldsName() {
    this.closService.getFieldsName().subscribe(res => {
      this.fieldsName = res['fieldName'];
      this.displayName = res['displayName'];
      this.dynamicColumndefinitions();
    })
  }

  //LISTING FUNCTION
  getAppVerificationData(pageData: PageData) {
    this.loadingItems = true;
    this.closService.getList(this.underwritingColumns, pageData.currentPage, pageData.pageSize, this.selectedTabName, this.isView, this.selectedNavigation, this.loanType).subscribe(res => {
      this.loadingItems = false;
      this.underwritingData = res['data'];
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }

  // TAB CHANGE FUNCTIONS
  underWritingTabChange(event: any) {
    sessionStorage.setItem('tabChange', this.encryptDecryptService.encryptData(event.tab.textLabel));
    localStorage.setItem('activeTab', this.encryptDecryptService.encryptData(event.index));
    if (event.index == 0) {
      this.selectedTabName = 'verificationQueue';
      this.selectedNavigation = 'UNDERWRITING_QUEUE';
      this.listDynamicColumns = []
      this.underwritingColumns = [];
      this.dynamicColumndefinitions();

    }
    else if (event.index == 1) {
      this.selectedTabName = 'verificationQueue';
      this.selectedNavigation = '	LOAN_APPROVAL_QUEUE';
      this.listDynamicColumns = []
      this.underwritingColumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 2) {
      this.selectedTabName = 'REJECT_UNDERWRITE';
      this.selectedNavigation = 'UNDERWRITING_REJECT';
      this.listDynamicColumns = []
      this.underwritingColumns = [];
      this.dynamicColumndefinitions();
    }
  }

  //  FILTER DROP DOWN FUNCTION 
  onApplyFilter(columnDetail: any) {
    this.closService.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
      columnDetail.column.dropDownList = res;
    })
    this.changeColumnData(columnDetail.column)
  }

  // FILTER  FUNCTIONS
  changeColumnData(columnDefinition) {
    this.isView = false;
    this.underwritingColumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.isView = false;
    this.underwritingColumns = event;
    this.getAppVerificationData(this.pageData);
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
    if (event.col && event.col.displayName === 'Underwriting Preview') {
      console.log("Dialog Data : "+ event.data.loanStatus)
      const dialogRef = this.dialog.open(UnderwritingPreviewPopupComponent, {
        height: '66rem',
        width: '150rem',
        data: event.data
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.getAppVerificationData(this.pageData);
      });
    }
    if (event.col && event.col.displayName === 'Credit Memo') {
      const dialogRef = this.dialog.open(CreditMemoPopupComponent, {
        width: '130rem', height: '77rem',
        data: event.data.id
      });
    }
    if (event.col && event.col.displayName === 'Ratio Preview') {
      const dialogRef = this.dialog.open(RatioPreviewPopupComponent, {
        width: '134rem', height: '66rem',
        data: event.data.id
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
          popupData: this.underwritingColumns, popupId: this.singleFinsurgeId, status: this.selectedTabName, selectedNavigation: this.selectedNavigation
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
          popupData: this.underwritingColumns, popupId: this.singleFinsurgeId, status: this.selectedTabName
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
          popupData: this.underwritingColumns,
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

  ngOnDestroy() {
    localStorage.removeItem('activeTab')
  }


  // EXPORT FUNCTION 
  underwritingExport(event: any,loanType: string) {
    this.closService.appVerificationExport(event.columns, event.format, this.selectedTabName, this.selectedNavigation,loanType).subscribe(res => {
      this.currentDownloadJob = res;
      if (this.downloadStatusSubscription) {
        this.downloadStatusSubscription.unsubscribe();
      }
      this.downloadStatusSubscription = timer(0, 2000)
        .pipe(
          switchMap(() => {
            return this.exportservice.getJob(res.id)
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
            this.exportservice.getFileByJob(res.id).subscribe(
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
    anchor.download = `UnderWriting${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

}

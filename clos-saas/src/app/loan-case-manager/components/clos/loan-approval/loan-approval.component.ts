import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { DownloadJob } from 'src/app/data-entry/services/download-service';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { ClosCaseManagerService } from 'src/app/loan-case-manager/service/clos-case-manager.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { DuplicatePreviewMultirowComponent } from '../../duplicate-preview-multirow/duplicate-preview-multirow.component';
import { SelfClaimComponent } from '../../self-claim/self-claim.component';
import { LoanApprovalEditComponent } from '../loan-approval-edit/loan-approval-edit.component';
import { LoanApprovalPreviewComponent } from '../loan-approval-preview/loan-approval-preview.component';

@Component({
  selector: 'app-loan-approval',
  templateUrl: './loan-approval.component.html',
  styleUrls: ['./loan-approval.component.scss']
})
export class LoanApprovalComponent implements OnInit {
  selectedIndex:number = 0;
  selectedTabName: string = 'verificationQueue';
  extraColumns: ColumnDefinition[] = [];
  applicationVerificationTabs: any[] = [
    { name: 'Loan Approval Queue', icon: 'list' },
    { name: 'Completed Application', icon: 'check' },
    { name: 'Reject Application', icon: 'close' },
  ]
  loadingItems: boolean;
  pageData: PageData = new PageData();
  loanApprovalcolumns: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];
  fieldsName: any[];
  displayName: any[];
  datefieldsName:any[];
  loanApprovalData:any[];
  isView: boolean = true;
  selectedNavigation: string = 'LOAN_APPROVAL_QUEUE';
  singleFinsurgeId: any;
  finsurgeIds:any[] = [];
  buttonCondition:boolean = false;
  loanType: string = '';

   // EXPORT
   downloadStatusSubscription: Subscription;
   currentDownloadJob: DownloadJob;
   
  constructor(
    public dialog: MatDialog,
    private defaultService: ClosCaseManagerService,
    public closService:CLosService,
    public datepipe: DatePipe,
    public encryptDecryptService: EncryptDecryptService
  ) {
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.loanApprovalcolumns=[];
    sessionStorage.removeItem('tabChange');
    this.defaultService.getData().subscribe((data) => {
      this.loanType = data?.data;
      this.getTableFieldsName();
    });    
    if (this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'))) {
      this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
      if (this.selectedIndex == 0) {
        this.selectedTabName = 'verificationQueue';
        this.selectedNavigation = 'LOAN_APPROVAL_QUEUE';  
      }
      // else if (this.selectedIndex == 1) {
      //   this.selectedTabName = 'PENDING';
      //   this.selectedNavigation = 'LOAN_APPROVAL_QUEUE';
      //   }
      else if (this.selectedIndex == 1) {
        this.selectedTabName = 'APPROVE_LOAN';
        this.selectedNavigation = 'LOAN_APPROVED';  
      }
      else if(this.selectedIndex == 2){
        this.selectedTabName = 'REJECT_LOAN';
        this.selectedNavigation = 'LOAN_REJECTED';  
      }
      // else if (this.selectedIndex == 3) {
      // this.selectedTabName = 'REJECT_LOAN';
      // this.selectedNavigation = 'LOAN_APPROVAL_QUEUE';
      // }
    }
}

  ngOnInit(): void {
    this.getTableFieldsName();
  }

  getExtraColumns() {
    if (this.selectedTabName === 'verificationQueue' && this.selectedNavigation === 'LOAN_APPROVAL_QUEUE') {
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
          fieldName: "$loan_approval_info_add",
          displayName: "Add Info",
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
          fieldName: "$loan_approval_preview",
          displayName: "Preview",
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
          this.loanApprovalcolumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.loanApprovalcolumns.push(columData)
        }
      }
      this.getloanApprovalData(this.pageData);

    }
    else if(this.selectedIndex == 1 || this.selectedIndex == 2) {
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
        // {
        //   fieldName: "$selfAssign",
        //   displayName: "Self Assign",
        //   lockColumn: false,
        //   columnDisable: true,
        //   searchText: [],
        //   sortAsc: null,
        //   isExport: false,
        //   hideExport: true,
        //   filterDisable: true,
        //   inOrder: false,
        // }
        // {
        //   fieldName: "$loan_approval_info_add",
        //   displayName: "Add Info",
        //   lockColumn: false,
        //   columnDisable: true,
        //   searchText: [],
        //   sortAsc: null,
        //   isExport: false,
        //   hideExport: true,
        //   filterDisable: true,
        //   inOrder: false,
        // },
        {
          fieldName: "$loan_approval_preview",
          displayName: "Preview",
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
          this.loanApprovalcolumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.loanApprovalcolumns.push(columData)
        }
      }
      this.getloanApprovalData(this.pageData);
    }
  }

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
        if (e.fieldName === 'id' || e.fieldName === 'loanAmount'|| e.fieldName === 'loanCurrency' || e.fieldName === 'termLoan' || e.fieldName === 'intrestRateType' || e.fieldName === 'requestRepaymentFrequency') {
          e.columnDisable = true;
          e.isExport = true;
        }
        if (e.fieldName === 'is_Duplicate' || e.fieldName === 'dupRejected') {
          e.isBoolean = true;
        }
      })
    }
    this.loanApprovalcolumns = this.listDynamicColumns
    this.getExtraColumns();
  }

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
    console.log("multiCheckDuplicatePreview", this.finsurgeIds);
    this.buttonCondition = true;
    const dialogRef = this.dialog.open(DuplicatePreviewMultirowComponent, {
      height: '85rem',
      width: '130rem',
      data: {
        popupData: this.loanApprovalcolumns, popupId: this.finsurgeIds, status: this.selectedTabName,selectedNavigation:this.selectedNavigation,
        buttonSelectAll: this.buttonCondition,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.selectedIndex = result;
      this.getloanApprovalData(this.pageData);
    });
  }

  getloanApprovalData(pageData: PageData) {
    this.loadingItems = true;
    this.defaultService.getList(this.loanApprovalcolumns, pageData.currentPage, pageData.pageSize, this.selectedTabName, this.isView, this.selectedNavigation,this.loanType).subscribe(res => {
      this.loadingItems = false;
      this.loanApprovalData = res['data'];
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }

  // TAB CHANGE FUNCTIONS
  loanApprovalTabChange(event: any) {
    sessionStorage.setItem('tabChange', this.encryptDecryptService.encryptData(event.tab.textLabel));
    localStorage.setItem('activeTab', this.encryptDecryptService.encryptData(event.index));
    if (event.index == 0) {
      this.selectedTabName = 'verificationQueue';
      this.selectedNavigation = 'LOAN_APPROVAL_QUEUE';
      this.listDynamicColumns = []
      this.loanApprovalcolumns = [];
      this.dynamicColumndefinitions();
    }
    // else if (event.index == 1) {
    //   this.selectedTabName = 'PENDING';
    //   this.selectedNavigation = 'LOAN_APPROVAL_QUEUE';
    //   this.listDynamicColumns = []
    //   this.loanApprovalcolumns = [];
    //   this.dynamicColumndefinitions();
    // }
    else if (event.index == 1) {
      this.selectedTabName = 'APPROVE_LOAN';
      this.selectedNavigation = 'LOAN_APPROVED';
      this.listDynamicColumns = []
      this.loanApprovalcolumns = [];
      this.dynamicColumndefinitions();
    }
    else if(event.index == 2){
      console.log("Coming Here...")
      this.selectedTabName = 'REJECT_LOAN';
      this.selectedNavigation = 'LOAN_REJECTED';
      this.listDynamicColumns = []
      this.loanApprovalcolumns = [];
      this.dynamicColumndefinitions();
    }
    // else if (event.index == 3) {
    //   this.selectedTabName = 'REJECT_LOAN';
    //   this.selectedNavigation = 'LOAN_APPROVAL_QUEUE';
    //   this.listDynamicColumns = []
    //   this.loanApprovalcolumns = [];
    //   this.dynamicColumndefinitions();
    // }
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
    this.loanApprovalcolumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.isView = false;
    this.loanApprovalcolumns = event;
    this.getloanApprovalData(this.pageData);
  }

  
  detailClick(event: any) {
    this.singleFinsurgeId=this.singleFinsurgeId || [];
    if (event.col && event.col.fieldName === '$selfAssign') {
      const id = event.data.id;
      if (!this.singleFinsurgeId.includes(id)) {
        this.singleFinsurgeId.push(id);
      }
  
      console.log(this.singleFinsurgeId);
  
      const dialogRef = this.dialog.open(SelfClaimComponent, {
        width: '25vw',
        height: '30vh',
        data: {
          popupData: this.loanApprovalcolumns,
          popupId: this.singleFinsurgeId,
          status: this.selectedTabName
        }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
        console.log('tabIndex', this.selectedIndex);
      });
    }
      // Preview Details
      if (event.col && event.col.displayName === 'Preview') {
        const dialogRef = this.dialog.open(LoanApprovalPreviewComponent, {
          height: '53rem',
          width: '110rem',
          data:{
            data: event.data.id,
            status: this.selectedNavigation,
          } 
        });
      }
       // Preview Details
       if (event.col && event.col.displayName === 'Add Info') {
        const dialogRef = this.dialog.open(LoanApprovalEditComponent, {
          height: '71rem',
          width: '130rem',
          data: event.data.id
        });
      }
  }

  handleSelectAllSelfAssign(selectedIds: number[]) {
    console.log("Received Selected FinSurge IDs in Application Verification:", selectedIds);
    this.singleFinsurgeId = this.singleFinsurgeId || [];
    this.singleFinsurgeId = selectedIds.slice(); 
    if (this.singleFinsurgeId.length > 0) {
      const dialogRef = this.dialog.open(SelfClaimComponent, {
        width: '25vw',
        height: '30vh',
        data: {
          popupData: this.loanApprovalcolumns,
          popupId: this.singleFinsurgeId,
          status: this.selectedTabName
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
      });
    }
  }
     // EXPORT FUNCTION 
     loanApprovalExport(event: any,loanType: string) {
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
      anchor.download = `Loan_Approval${latest_date}.${format}`;
      anchor.href = url;
      anchor.click();
    }
    
    ngOnDestroy() {
      localStorage.removeItem('activeTab')
    }
}

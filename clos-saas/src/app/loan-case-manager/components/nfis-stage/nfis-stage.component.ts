import { DatePipe } from '@angular/common';
import { Component, OnInit, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { DownloadJob } from 'src/app/loan-application/common/download.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';
import { DepositerbaseViewdetailsPopupComponent } from '../depositerbase-viewdetails-popup/depositerbase-viewdetails-popup.component';
import { DuplicatePreviewMultirowComponent } from '../duplicate-preview-multirow/duplicate-preview-multirow.component';
import { DuplicatePreviewPopupComponent } from '../duplicate-preview-popup/duplicate-preview-popup.component';
import { SelfClaimComponent } from '../self-claim/self-claim.component';

@Component({
  selector: 'app-nfis-stage',
  templateUrl: './nfis-stage.component.html',
  styleUrls: ['./nfis-stage.component.scss']
})
export class NfisStageComponent implements OnInit {

  internalscoringcolums: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];
  fieldsName: any[];
  loadingItems: boolean;
  pageData: PageData = new PageData();
  columns: ColumnDefinition[];
  extraColumns: ColumnDefinition[] = [];
  internalscoringdata: any[];
  selectedTabName: string = 'verificationQueue';
  selectedIndex: number = 0;
  tabletab:any;
  currentUrl: any;
  fsId: any;
  buttonCondition: boolean = false;
  finsurgeIds: any[] = [];
  isView:boolean=true;
  selectedNavigation: string ='NTB_NFIS_TU_VERIFICATION';
  singleFinsurgeId: any[] = [];
  datefieldsName:any[];
  displayName: any[];
  listUInternalScoringTab: any[] = [
    { name: 'Verification Queue', icon: 'list' },
    { name: 'Verification In Progress', icon: 'refresh' },
    { name: 'Not Match', icon: 'check' },
    { name: 'Exact Match', icon: 'close' },
   // { name: 'Unverified', icon: 'cancel' },

  ]

  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;

  constructor(
    private casemanagementService: LoanCaseManagerServiceService,
    private router: Router,
    public dialog: MatDialog,
    private defaultService: LoanServiceService,
    public datepipe: DatePipe,
    public encryptDecryptService: EncryptDecryptService
  ) {
    this.getDateFieldsName();
    this.internalscoringcolums = [];
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.internalscoringdata = []
    this.currentUrl = window.location.href;
    sessionStorage.removeItem('tabChange');
  
   if (this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'))) {
    this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
    //console.log("session",this.tabletab)
    if (this.selectedIndex == 0) {
      this.selectedTabName = 'verificationQueue';
    }
    else if (this.selectedIndex == 1) {
      this.selectedTabName = 'verificationInProgress'
      this.getTableFieldsName();
    }
    else if (this.selectedIndex == 2) {
      this.selectedTabName = 'notMatch'
    }
    else if (this.selectedIndex == 3) {
      this.selectedTabName = 'exactMatch'

    }
    else if (this.selectedIndex == 4) {
      this.selectedTabName = 'Unverified'
    }

  }
  }

  ngOnInit(): void {
    
    this.getTableFieldsName();
  }

  getExtraColumns() {
    if (this.selectedTabName === 'verificationQueue') {
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
          this.internalscoringcolums.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.internalscoringcolums.push(columData)
        }
      }
      this.getInternalScoringata(this.pageData);

    }
    else {
      this.extraColumns = [


        {
          fieldName: "processor",
          displayName: "Processor",
          lockColumn: false,
          columnDisable: true,
          searchText: [],
          sortAsc: null,
          isExport: true,
          hideExport: false,
          filterDisable: false,
          inOrder: true,
          isList:true

        },
        
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
          displayName: "Duplicate Preview",
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
          this.internalscoringcolums.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.internalscoringcolums.push(columData)
        }
      }
      this.getInternalScoringata(this.pageData);
    }

  }

  // GET  TABLE FIELDS 
  getTableFieldsName() {
    this.casemanagementService.getFieldsName().subscribe(res => {
      this.fieldsName = res['fieldName'];
      this.displayName = res['displayName'];
      this.dynamicColumndefinitions();
    })
  }

// GET DATE FIELDS
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
          if ( e.fieldName === 'id'||e.fieldName === 'processor' || e.fieldName === 'finsurgeId' || e.fieldName === 'appmBank' || e.fieldName === 'appmNbr' || e.fieldName === 'appMrefer') {
            e.columnDisable = true;
            e.isExport = true;
          }
          if (e.fieldName === 'is_Duplicate' || e.fieldName === 'dupRejected') {
            e.isBoolean = true;
          }
        })
        // }
    }
    this.internalscoringcolums = this.listDynamicColumns
    this.getExtraColumns();
  }
  //LISTING FUNCTION
  getInternalScoringata(pageData: PageData) {
    this.loadingItems = true;
    this.casemanagementService.getList(this.internalscoringcolums, pageData.currentPage, pageData.pageSize, this.selectedTabName,this.isView,this.selectedNavigation).subscribe(res => {
      this.loadingItems = false;
      this.internalscoringdata = res['data'];
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }

  // TAB CHANGE FUNCTIONS
  internalScoringTabChange(event: any) {
    sessionStorage.setItem('tabChange', this.encryptDecryptService.encryptData(event.tab.textLabel));
    localStorage.setItem('activeTab', this.encryptDecryptService.encryptData(event.index));
    if (event.index == 0) {
      this.selectedTabName = 'verificationQueue';
      this.listDynamicColumns = []
      this.internalscoringcolums = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 1) {
      this.selectedTabName = 'verificationInProgress';
      this.listDynamicColumns = []
      this.internalscoringcolums = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 2) {
      this.selectedTabName = 'notMatch';
      this.listDynamicColumns = []
      this.internalscoringcolums = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 3) {
      this.selectedTabName = 'exactMatch';
      this.listDynamicColumns = []
      this.internalscoringcolums = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 4) {
      this.selectedTabName = 'Unverified';
      this.listDynamicColumns = []
      this.internalscoringcolums = [];
      this.dynamicColumndefinitions()

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
    this.isView=false;
    this.internalscoringcolums.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.isView=false;
    this.internalscoringcolums = event;
    this.getInternalScoringata(this.pageData);
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
        height: '80rem',
        width: '130rem',

        data: {
          popupData: this.internalscoringcolums, popupId: this.singleFinsurgeId, status: this.selectedTabName,selectedNavigation:this.selectedNavigation
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
      });
    }

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
          popupData: this.internalscoringcolums, popupId: this.singleFinsurgeId, status: this.selectedTabName
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.dynamicColumndefinitions();
        this.selectedIndex = result;
        console.log('tabIndex',this.selectedIndex);
    
      });
    }
  }

  // EXPORT FUNCTION 
  internalScoringListExport(event: any) {
    this.casemanagementService.internalScoringListExport(event.columns, event.format, this.selectedTabName,this.selectedNavigation).subscribe(res => {
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
    anchor.download = `NFIS Matching${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

  multiCheckData(event: any) {
    this.finsurgeIds = event;

  }

  //multicheck Duplicate Preview
  multiCheckDuplicatePreview(event: any) {
    console.log("multiCheckDuplicatePreview", this.finsurgeIds);
    this.buttonCondition = true;
    const dialogRef = this.dialog.open(DuplicatePreviewMultirowComponent, {
      height: '80rem',
      width: '130rem',
      data: {
        popupData: this.internalscoringcolums, popupId: this.finsurgeIds, status: this.selectedTabName,selectedNavigation:this.selectedNavigation,
        buttonSelectAll: this.buttonCondition,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.selectedIndex = result;
    });
  }

  //multicheck SelfAssign 
  multiCheckSelfAssign(event: any) {
    this.buttonCondition = true;
    const dialogRef = this.dialog.open(SelfClaimComponent, {
      width: '25vw',
      height: '30vh',
      data: {
        popupData: this.internalscoringcolums, popupId: this.finsurgeIds, status: this.selectedTabName,
        buttonSelectAll: this.buttonCondition,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.selectedIndex = result;
      this.dynamicColumndefinitions();
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('activeTab')

  }
}

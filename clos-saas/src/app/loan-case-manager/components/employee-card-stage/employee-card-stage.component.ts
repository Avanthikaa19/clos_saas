import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, filter, of, Subscription, timer, switchMap } from 'rxjs';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { DownloadJob } from 'src/app/loan-application/common/download.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';
import { SelfClaimComponent } from '../self-claim/self-claim.component';

@Component({
  selector: 'app-employee-card-stage',
  templateUrl: './employee-card-stage.component.html',
  styleUrls: ['./employee-card-stage.component.scss']
})
export class EmployeeCardStageComponent implements OnInit {
  selectedNavigation: string ='EMP_MANUAL_VERIFICATION';
  employeeCardColumns: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];
  fieldsName: any[];
  loadingItems: boolean;
  pageData: PageData = new PageData();
  columns: ColumnDefinition[];
  extraColumns: ColumnDefinition[] = [];
  employeeCardData: any[];
  selectedTabName: string = 'verificationQueue';
  selectedIndex: number = 0;
  currentUrl: any;
  fsId: any;
  buttonCondition: boolean = false;
  isView:boolean=true;
  finsurgeIds: any[] = [];
  singleFinsurgeId: any[] = [];
  datefieldsName:any[];
  displayName: any[];
  employeeDecision: EmployeeDecision= new EmployeeDecision()
  listUEmployeeCardTab: any[] = [
    { name: 'Verification Queue', icon: 'list' },
    { name: 'Verification In Progress', icon: 'refresh' },
    { name: 'Regular', icon: 'check' },
    { name: 'Probationary', icon: 'close' },
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
    public encryptDecryptService: EncryptDecryptService,
    private duplicateService: DuplicateCheckingService,
  ) {
    this.getDateFieldsName();
    this.employeeCardColumns = [];
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.employeeCardData = []
    this.currentUrl = window.location.href;
    sessionStorage.removeItem('tabChange');
    if (this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'))) {
      this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
      if (this.selectedIndex == 0) {
        this.selectedTabName = 'verificationQueue';
      }
      else if (this.selectedIndex == 1) {
        this.selectedTabName = 'verificationInProgress'
        this.getTableFieldsName();
      }
      else if (this.selectedIndex == 2) {
        this.selectedTabName = 'regular'
      }
      else if (this.selectedIndex == 3) {
        this.selectedTabName = 'probationary'

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
          fieldName: "$view_detailss",
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
          fieldName: "$document_previews",
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
          this.employeeCardColumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.employeeCardColumns.push(columData)
        }
      }
      this.getEmployeeCardData(this.pageData);

    }

   else if (this.selectedTabName === 'verificationInProgress') {
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
          fieldName: "$employee_progress_view_details",
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
          fieldName: "$employee_progress_document_preview",
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
          fieldName: "$Regular",
          displayName: "Regular",
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
          fieldName: "$Probationary",
          displayName: "Probationary",
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
          this.employeeCardColumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.employeeCardColumns.push(columData)
        }
      }
      this.getEmployeeCardData(this.pageData);

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
          fieldName: "$employee_other_view_detailss",
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
          fieldName: "$employee_other_document_previews",
          displayName: "Document Preview",
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
          this.employeeCardColumns.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.employeeCardColumns.push(columData)
        }
      }
      this.getEmployeeCardData(this.pageData);

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
          if (e.fieldName === 'processor') {
            e.isList = true;
          }
        })
        // }
    }
    this.employeeCardColumns = this.listDynamicColumns
    this.getExtraColumns();
  }

  //LISTING FUNCTION
  getEmployeeCardData(pageData: PageData) {
    this.loadingItems=true;
    this.casemanagementService.getList(this.employeeCardColumns, pageData.currentPage, pageData.pageSize, this.selectedTabName,this.isView,this.selectedNavigation).subscribe(res => {
      this.loadingItems=false;
      this.employeeCardData = res['data'];
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }

  // TAB CHANGE FUNCTIONS
  employeeCardTabChange(event: any) {
    sessionStorage.setItem('tabChange', this.encryptDecryptService.encryptData(event.tab.textLabel));
    localStorage.setItem('activeTab', this.encryptDecryptService.encryptData(event.index));
    if (event.index == 0) {
      this.selectedTabName = 'verificationQueue';
      this.listDynamicColumns = []
      this.employeeCardColumns = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 1) {
      this.selectedTabName = 'verificationInProgress';
      this.listDynamicColumns = []
      this.employeeCardColumns = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 2) {
      this.selectedTabName = 'regular';
      this.listDynamicColumns = []
      this.employeeCardColumns = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 3) {
      this.selectedTabName = 'probationary';
      this.listDynamicColumns = []
      this.employeeCardColumns = [];
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
    this.employeeCardColumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.employeeCardColumns = event;
    this.getEmployeeCardData(this.pageData);
  }

  //BUTTON CLICK FUNCTION
  detailClick(event: any) {
    if (event.col && event.col.displayName === 'View Details') {
      console.log("event click", event.data.id)
      // const dialogRef = this.dialog.open(DepositerbaseViewdetailsPopupComponent, {
      //       width: '1400px', height: '850px', data: event.data.id
      //     });
    }

    // Preview Details
    if (event.col && event.col.displayName === 'Document Preview') {
      const dialogRef = this.dialog.open(DocumentViewComponent, {
        width: '700px', height: '420px', data: event.data.id
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
          popupData: this.employeeCardColumns, popupId: this.singleFinsurgeId, status: this.selectedTabName
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
        console.log(this.selectedIndex);
       // this.dynamicColumndefinitions();
    
      });
    }

     // NO FRAUD CLICK
     if (event.col && event.col.displayName === 'Regular') {
      console.log("event.data.id", event.data.id)
      this.employeeDecision.id=event.data.id;
      this.employeeDecision.action='REGULAR'
      this.duplicateService.employeeDecision(this.employeeDecision.id, this.employeeDecision.action).subscribe((res) => {
        console.log("regular res", res);
      });
      this.selectedIndex = 2;
    }

     // FRAUD CLICK
     if (event.col && event.col.displayName === 'Probationary') {
      console.log("event.data.id", event.data.id)
      this.employeeDecision.id=event.data.id;
      this.employeeDecision.action='PROBATIONARY'
      this.duplicateService.employeeDecision(this.employeeDecision.id, this.employeeDecision.action).subscribe((res) => {
        console.log("probationary res", res);
      });
      this.selectedIndex = 3;
    }
  }

  // EXPORT FUNCTION 
  employeeCardListExport(event: any) {
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
    anchor.download = `EmployeeCardStage${latest_date}.${format}`;
    anchor.href = url;
    anchor.click();
  }

  multiCheckData(event: any) {
    this.finsurgeIds = event;

  }


  //multicheck SelfAssign 
  multiCheckSelfAssign(event: any) {
    this.buttonCondition = true;
    const dialogRef = this.dialog.open(SelfClaimComponent, {
      width: '25vw',
      height: '30vh',
      data: {
        popupData: this.employeeCardColumns, popupId: this.finsurgeIds, status: this.selectedTabName,
        buttonSelectAll: this.buttonCondition,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.selectedIndex = result;
     // this.dynamicColumndefinitions();
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('activeTab')

  }

  

}
export class EmployeeDecision {
  id?: string[];
  action?: string;
}
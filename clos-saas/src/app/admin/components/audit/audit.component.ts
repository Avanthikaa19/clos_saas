import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTabGroup } from '@angular/material/tabs';
import { ModuleNames } from 'ag-grid-community';
import { index } from 'd3-array';
import { catchError, filter, of, timer , switchMap, Subscription} from 'rxjs';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { audit } from '../administrator-dashboard/models/counts-model';
import { AdminDashboardService } from '../administrator-dashboard/services/admin-dashboard.service';
import { DownloadJob } from '../users/services/download-data.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  auditcolumns: ColumnDefinition[] = [];
  loadingItems: boolean = false;
  pageData: PageData;
  auditData: string[] = [];
  view: boolean = false;
  selectedModule: string = 'CaseManagement';
  selectedObject: string = 'DuplicateChecking';
  selectedAuditObject: string = 'Audit_CASEMANAGEMENT'
  // pageNum: number = 0;
  // pageSize: number = 10;
  // caseObject: any[] = ['Audit_CASEMANAGEMENT'];
  // loanObject: any[] = ['Audit_LOANORIGINATION'];
  // flowObject: any[] = ['Audit_FLOWS'];
  // auditObject: any[] = ['Audit_CASEMANAGEMENT', 'Audit_LOANORIGINATION', 'Audit_FLOWS'];

  // audits: audit = new audit('created', 'Date', true, false, true, 'dd MMM yyyy', null, [], true, []);
  // module: any[] = ['LOAN_ORIGINATION', 'CASEMANAGEMENT', 'Flows'];
  // loan: any[] = ['Application', 'Documents', 'Full_Data_Capture', 'Initial_Data_Capture', 'User'];
  // flows: any[] = ['Task', 'Workflow', 'Worksheet'];
  // case: any[] = ['verification_queue', 'underwriter_queue'];
  // moduleName: string = '';
  // subModuleName: string = '';
  //auditObject: string = '';
  // auditName: string = '';

  // auditCount: number;
  // auditHeader = ['User', 'Module', 'Screen', 'Action', 'Description', 'Time', 'Date'];
  // dateFormat: string;
  loading: boolean = false;


  @ViewChild('subTabGroup') subTabGroup: MatTabGroup;
  mainTabs: any[] = [
    { name: 'CaseManagement', icon: 'work_outline' },
    { name: 'Flows', icon: 'join_inner' }
  ];
  subTabs: any[] = [
    [{ name: 'DuplicateChecking', icon: 'credit_score' }],
    [{ name: 'Task', icon: 'credit_score' }, { name: 'Workflow', icon: 'credit_score' }, { name: 'Worksheet', icon: 'credit_score' }],
    // [{ name: 'Duplicate Checking 3', icon: 'credit_score' }],
  ];
  selectedMainTabIndex: number = 0;
  selectedSubTabIndex: number = 0;

  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;

  constructor(
    public admin: AdminDashboardService,
    private defaultService: LoanServiceService,
    public datepipe: DatePipe
  ) {

    this.auditcolumns = []
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 40;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 0;
    this.pageData.totalRecords = 0;

    this.auditcolumns = [
      {
        fieldName: "created",
        displayName: "Date",
        lockColumn: true,
        sortAsc: null,
        isExport: true,
        dateFormat: "dd MMM yyyy",
        searchText: null,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "createdTime",        
        displayName: "Time",
        lockColumn: true,
        sortAsc: null,
        isExport: true,
        //  dateFormat: "dd MMM yyyy",
        searchText: null,
        dropDownList: [],
        searchItem: [],
      },
      {
        fieldName: "user",
        displayName: "User",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "module",
        displayName: "Module",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "object",
        displayName: "Screen",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "action",
        displayName: "Activity",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "objectName",
        displayName: "Description",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },

      // {
      //   fieldName: "auditBodies",
      //   displayName: "Parameters",
      //   lockColumn: true,
      //   sortAsc: null,
      //   searchText: [],
      //   isExport: true,
      // },
    ];
  }
  
  ngOnInit(): void {
    this.getAudits(this.pageData);
  }

  selectedSubTabs: any[] = []
  onMainTabChangeEvent(event: any) {
    console.log("EVENT 1", event);
    // this.selectedModule = event.tab.textLabel;
    // this.selectedModule = this.mainTabs[event.index];
    // this.selectedObject = this.subTabs[event.index][0];
    // console.log('selected module', this.selectedModule);
    this.selectedSubTabs = this.subTabs[event.index]
    this.subTabGroup.selectedIndex = 0;
    this.selectedModule = this.mainTabs[event.index].name;
    this.selectedObject =  this.selectedSubTabs[0].name;
    console.log("caseManagement",this.selectedModule)
    
   if(this.selectedModule==='CaseManagement'){
    console.log("caseManagement")
    this.selectedAuditObject='Audit_CASEMANAGEMENT'
  }
 else if(this.selectedModule==='Flow'){
    console.log("flows")
    this.selectedAuditObject='';
    this.selectedAuditObject='Audit_FLOWS';
    console.log("Object",this.selectedAuditObject)
  }
    this.getAudits(this.pageData);
    // this.onsubTabChangeEvent(event, this.selectedObject);
   
  }
  onsubTabChangeEvent(event: any, mainIndex: number) {
    console.log("EVENT 2", event)
    // this.selectedObject = event.tab.textLabel;
    // this.selectedObject = this.subTabs[this.selectedMainTabIndex][event.index];
    this.selectedModule = this.mainTabs[mainIndex].name;
    this.selectedObject =  this.selectedSubTabs[event.index].name;
    this.getAudits(this.pageData);
  }

  getAuditsOne(selectedMainTab: any, selectedSubTab: any) {
    console.log('main', selectedMainTab.name);
    console.log('sub', selectedSubTab.name)
  }

  //Get All Audit
  getAudits(pageData: PageData) {
  this.admin.getAudit(this.auditcolumns, this.pageData.currentPage, this.pageData.pageSize, this.selectedModule, this.selectedObject, this.selectedAuditObject, this.view).subscribe(
      res => {
        this.loading = false;
        this.auditData = res['data'];
        this.pageData.count = res['count']
        this.pageData.totalPages = res['count']
      }
    )
  }

  // changeTab(index: number) {
  //   this.selectedTabIndex = index;
  // }

  //FILTER DROP DOWN FUNCTION 

  onApplyFilter(columnDetail: any) {
    this.admin.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
      columnDetail.column.dropDownList = res;
    })
    this.changeColumnData(columnDetail.column)
  }

  //FILTER  FUNCTIONS
  changeColumnData(columnDefinition) {
    this.view = true;
    this.auditcolumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.view = true;
    this.auditcolumns = event;
    this.getAudits(this.pageData);
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
    anchor.download = `Activity Log`;
    anchor.href = url;
    anchor.click();
  }
}





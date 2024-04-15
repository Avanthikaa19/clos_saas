import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { LoanCaseManagerServiceService } from 'src/app/loan-case-manager/service/loan-case-manager-service.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { CiApplicationPreviewComponent } from '../../ci-application-preview/ci-application-preview.component';
import { DepositerbaseViewdetailsPopupComponent } from '../../depositerbase-viewdetails-popup/depositerbase-viewdetails-popup.component';
import { SelfClaimComponent } from '../../self-claim/self-claim.component';

@Component({
  selector: 'app-ci-applications-list',
  templateUrl: './ci-applications-list.component.html',
  styleUrls: ['./ci-applications-list.component.scss']
})
export class CiApplicationsListComponent implements OnInit {
  listUInternalScoringTab: any[] = [
    { name: 'Verification Queue', icon: 'list' },
    { name: 'Verification In Progress', icon: 'refresh' },
    { name: 'Pending CI', icon: 'query_builder' },
    { name: 'Contacted', icon: 'thumb_up_alt' },
    { name: 'Uncontacted', icon: 'thumb_down_alt' },
  ]
  pageData: PageData = new PageData();
  columns: ColumnDefinition[];
  selectedIndex: number = 0;
  applicationDetailsColumn: ColumnDefinition[] = [];
  applicationDetailsData: any[];
  loadingItems: boolean = false;
  currentUrl:any;
  fieldName: any[];
  displayName: any[];
  listDynamicColumns: ColumnDefinition[] = [];
  datefieldName:any[];
  extraColumns: ColumnDefinition[] = [];
  selectedTabName: string = 'verificationQueue';
  isView:boolean = true;
  selectedNavigation: string ='CREDIT_VERIFICATION';
  singleFinsurgeId: any[] = [];
  constructor(
    private casemanagementService: LoanCaseManagerServiceService,
    private router: Router,
    public dialog: MatDialog,
    private defaultService: LoanServiceService,
    public datepipe: DatePipe,
    public encryptDecryptService: EncryptDecryptService
  ) { 
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.applicationDetailsColumn =[];
    this.applicationDetailsData = []
    this.currentUrl = window.location.href;
    sessionStorage.removeItem('tabChangeEvent');
    if (this.encryptDecryptService.decryptData(localStorage.getItem('currentTab'))) {
      this.selectedIndex = this.encryptDecryptService.decryptData(localStorage.getItem('currentTab'));
      if (this.selectedIndex == 0) {
        this.selectedTabName = 'verificationQueue';
      }
      else if (this.selectedIndex == 1) {
        this.selectedTabName = 'verificationInProgress'
        this.getTableFieldsName();
      }
      else if (this.selectedIndex == 2) {
        this.selectedTabName = 'Pending'
      }
      else if (this.selectedIndex == 3) {
        this.selectedTabName = 'contacted'

      }
      else if (this.selectedIndex == 4) {
        this.selectedTabName = 'Uncontacted'
      }

    }
  }

  ngOnInit(): void {
    this.getTableFieldsName();
  }

   // GET  TABLE FIELDS 
   getTableFieldsName() {
    this.casemanagementService.getFieldsName().subscribe(res => {
      this.fieldName = res['fieldName'];
      this.displayName = res['displayName'];
      this.dynamicColumndefinitions();
    })
  }

  getExtraColumns() {
    if(this.selectedTabName == 'verificationQueue'){
      this.extraColumns = [
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
          this.applicationDetailsColumn.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.applicationDetailsColumn.push(columData)
        }
      }
      this.getApplicationListData(this.pageData);
    }
    else{
      this.extraColumns = [
        {
          fieldName: "$view_details_ciApp",
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
          fieldName: "$document_previews_ciApp",
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
          fieldName: "$preview_ciApp",
          displayName: "Preview",
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
          this.applicationDetailsColumn.unshift(columData)
        }
        if (columData.inOrder === false) {
          this.applicationDetailsColumn.push(columData)
        }
      }
      this.getApplicationListData(this.pageData); 
    }
  }

  // TAB CHANGE FUNCTIONS
  internalScoringTabChange(event: any) {
    sessionStorage.setItem('tabChangeEvent', this.encryptDecryptService.encryptData(event.tab.textLabel));
    localStorage.setItem('currentTab', this.encryptDecryptService.encryptData(event.index));
    if (event.index == 0) {
      this.selectedTabName = 'verificationQueue';
      this.listDynamicColumns = []
      this.applicationDetailsColumn = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 1) {
      this.selectedTabName = 'verificationInProgress';
      this.listDynamicColumns = []
      this.applicationDetailsColumn = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 2) {
      this.selectedTabName = 'Pending';
      this.listDynamicColumns = []
      this.applicationDetailsColumn = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 3) {
      this.selectedTabName = 'contacted';
      this.listDynamicColumns = []
      this.applicationDetailsColumn = [];
      this.dynamicColumndefinitions()

    }
    else if (event.index == 4) {
      this.selectedTabName = 'Uncontacted';
      this.listDynamicColumns = []
      this.applicationDetailsColumn = [];
      this.dynamicColumndefinitions()

    }

  }

    //DYNAMIC COLUMN DEFINITION CREATION
    dynamicColumndefinitions() {
      console.log('FIELDS NAME', this.fieldName);
      console.log('DATE FIELDS NAME', this.datefieldName);
      for (let i = 0; i < this.fieldName.length; i++) {
        // this.fieldsName?.forEach(value => {
          if (this.datefieldName?.includes(this.fieldName[i])) {
            let columnDef: ColumnDefinition = new ColumnDefinition();
            columnDef.fieldName = this.fieldName[i];
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
            columnDef.fieldName = this.fieldName[i];
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
      this.applicationDetailsColumn = this.listDynamicColumns
      this.getExtraColumns();
    }
     //LISTING FUNCTION
  getApplicationListData(pageData: PageData) {
    this.loadingItems=true;
    this.casemanagementService.getList(this.applicationDetailsColumn, pageData.currentPage, pageData.pageSize, this.selectedTabName,this.isView,this.selectedNavigation).subscribe(res => {
      this.loadingItems=false;
      this.applicationDetailsData = res['data'];
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
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
      this.applicationDetailsColumn.forEach(column => {
        if (column.fieldName == columnDefinition.fieldName) {
          column = columnDefinition
        }
      })
    }
    columnChange(event: ColumnDefinition[]) {
      this.applicationDetailsColumn = event;
      this.getApplicationListData(this.pageData);
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

    if (event.col && event.col.displayName === 'Preview') {
      const dialogRef = this.dialog.open(CiApplicationPreviewComponent, {
        height: '85rem',
        width: '140rem',

        data: {
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
      const dialogRef = this.dialog.open(SelfClaimComponent, {
        width: '25vw',
        height: '30vh',
        data: {
          popupData: this.applicationDetailsColumn, popupId: this.singleFinsurgeId, status: this.selectedTabName
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.selectedIndex = result;
        console.log(this.selectedIndex);
       // this.dynamicColumndefinitions();
    
      });
    }
  }
}

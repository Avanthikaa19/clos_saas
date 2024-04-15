import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { ApplicationDetailPopupComponent } from 'src/app/data-entry/initial-display/application-detail-popup/application-detail-popup.component';
import { ViewResultStatusComponent } from 'src/app/data-entry/initial-display/view-result-status/view-result-status.component';
import { DownloadJob } from 'src/app/data-entry/services/download-service';
import { DocumentViewComponent } from 'src/app/duplicate-checking/components/document-view/document-view.component';
import { ClickEvent, ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ApplicationEntryService } from '../../application-entry/service/application-entry.service';
import { ApplicationEntryPopupComponent } from '../application-entry-popup/application-entry-popup.component';
import { ApplicationDetails } from 'src/app/c-los/models/clos';
import { DashboardpopupComponent } from 'src/app/general/components/dashboardpopup/dashboardpopup.component';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { CustomiseDashboard, SearchScope } from 'src/app/dynamic-dashboard/dynamic-dashboard/models/model';
import { CustomServiceService } from 'src/app/dynamic-dashboard/dynamic-dashboard/service/custom-service.service';

@Component({
  selector: 'app-application-view-listing',
  templateUrl: './application-view-listing.component.html',
  styleUrls: ['./application-view-listing.component.scss']
})
export class ApplicationViewListingComponent implements OnInit {
  id:any;
  customLayout = new CustomiseDashboard();
  applicationColumns: ColumnDefinition[] = [];
  listDynamicColumns: ColumnDefinition[] = [];
  columns: ColumnDefinition[];
  pageData: PageData = new PageData();
  loadingItems: boolean;

  fieldsName: any[];
  displayName: any[];
  applicationLogData: any[];
  extraColumns: ColumnDefinition[];
  datefieldsName: any[];
  isView: boolean = true;
  selectedTabName: string = 'allApplications';
  selectedNavigation: string = '';

  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;
  activeTabIndex: number = 0; // Default active tab index (0 for the first tab)

  matTabHeader: any[] = [
    { name: 'All Applications', icon: 'list' },
    { name: 'Draft Application', icon: 'save' },
    { name: 'Info Required', icon: 'assignment' },
  ]

  constructor(
    public notifierService: NotifierService,
    private router: Router,
    public dialog: MatDialog,
    public encryptDecryptService: EncryptDecryptService,
    public datepipe: DatePipe,
    private closServices: CLosService,
    public customService:CustomServiceService,
  ) {
    this.loadingItems = true;
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.pageData.count;
    this.applicationColumns = [];
    this.applicationLogData = [];
    const gridLayoutData = sessionStorage.getItem('grid-layout');
    if (gridLayoutData) {
      this.customLayout = JSON.parse(gridLayoutData);
      this.id=this.customLayout.id;
      this.viewDashboard(this.id);
    } else {
      this.customService.homeMapping().subscribe(res => {
        this.customLayout=res;
        this.id=this.customLayout.id;
        this.viewDashboard(this.id);
      })
      // Handle the case where grid-layout data is missing.
    }   
    sessionStorage.removeItem('tabChange');
    if (this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'))) {
      this.activeTabIndex = this.encryptDecryptService.decryptData(localStorage.getItem('activeTab'));
      if (this.activeTabIndex == 0) {
        this.selectedTabName = 'allApplications'
        this.selectedNavigation = '';
      }
      else if (this.activeTabIndex == 1) {
        this.selectedNavigation = 'DRAFT';
      }
      else if (this.activeTabIndex == 2) {
        this.selectedNavigation = 'PENDING'
      }
    }
  }

  ngOnInit(): void {
    this.getTableFieldsName();
  }
  getUserName:any='';
  pageNumber:number=1;
  searchscope:SearchScope=new SearchScope(10,'map')
  totalCount:number;
  screens=[];
  allTemplate=[];
  getMapping(name){
		sessionStorage.setItem('dashName',name);
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
      this.getUserName=this.encryptDecryptService.decryptData(user);
		this.customService.getMapping(name, this.getUserName,this.pageNumber-1,this.searchscope.pageSize,'').subscribe(res=>{
		//   this.allTemplate = res['result'];
		  let data=res['result']
		  this.totalCount=res['count']
		  this.screens = [];
      this.allTemplate=[];
		  this.allTemplate?.forEach(e => {
			this.screens?.push(e.selectedScreen);
		  })
		  data?.forEach(e=>{
			  this.allTemplate?.push(e)
		  })
		})
	  }

  getExtraColumns() {
    if (this.selectedNavigation == '') {
      this.extraColumns = [
        {
          fieldName: "$view_details_all",
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
          fieldName: "$document_preview_all",
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
          fieldName: "$result_preview_all",
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
          fieldName: "dashboard",
          displayName: "Dashboard",
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
          displayName: "All Status",
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
  
  // TAB CHANGE FUNCTIONS
  appVerificationTabChange(event: any) {
    sessionStorage.setItem('tabChange', this.encryptDecryptService.encryptData(event.tab.textLabel));
    localStorage.setItem('activeTab', this.encryptDecryptService.encryptData(event.index));
    if (event.index == 0) {
      this.selectedNavigation = '';
      this.pageData.currentPage = 1;
      this.selectedTabName = 'allApplications'
      this.listDynamicColumns = []
      this.applicationColumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 1) {
      this.pageData.currentPage = 1;
      this.selectedNavigation = 'DRAFT';
      this.listDynamicColumns = []
      this.applicationColumns = [];
      this.dynamicColumndefinitions();
    }
    else if (event.index == 2) {
      this.pageData.currentPage = 1;
      this.selectedNavigation = 'PENDING';
      this.listDynamicColumns = []
      this.applicationColumns = [];
      this.dynamicColumndefinitions();
    }
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
        if (this.displayName[i] !== 'STATUS' && this.displayName[i] !== 'applicationResult'){
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
          if (e.fieldName === 'id' || e.fieldName === 'applicantName' || e.fieldName === 'entityName'|| e.fieldName === 'mail_id'  || e.fieldName === 'typesOfLoan' || e.fieldName === 'share' || e.fieldName === 'nationality'|| e.fieldName === 'designation') {
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
  viewDashboard(id){
    this.id=id;
      this.customService.getTemplateWithId(id).subscribe(res =>{
      let layout = res;
      layout.widget.map((element)=>{
        element.actualData = JSON.parse(element.data);
      });
      sessionStorage.setItem('grid-layout1',JSON.stringify(res));
  //   window.location.reload();
      // this.navToUrl(['/dynamic/dynamic/dashboardMapping']);
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
    if (clickEvent.col && clickEvent.col.displayName === 'View Result Status') {
      const dialogRef = this.dialog.open(ViewResultStatusComponent, {
        panelClass: 'view-details-panel',
        width: '150rem', height: '85rem', data: clickEvent.data.id
      });
    }

    // Duplicate Details
    if (clickEvent.col && clickEvent.col.displayName === 'Duplicate Preview') {
      let viewUrl = 'loan-application-matching/main-nav/duplicate-view';
      this.router.navigate([viewUrl], { queryParams: { fsId: clickEvent.data.finsurgeId } })
    }

    // Preview Details
    if (clickEvent.col && clickEvent.col.displayName === 'Document Preview') {
      const dialogRef = this.dialog.open(DocumentViewComponent, {
        width: '700px', height: '420px', data: clickEvent.data.id
      });
    }
    // Dashboard
    if (clickEvent.col && clickEvent.col.displayName === 'Dashboard') {
      const dialogRef = this.dialog.open(DashboardpopupComponent, {
        width: '95vw', height: '95vh', data: clickEvent.data
      });
    }
  
    // Edit button Click
    if (clickEvent.col && clickEvent.col.displayName === 'Edit') {
      let data = clickEvent.data;
      let encryptID = this.encryptDecryptService.encryptData((data.id).toString())
      sessionStorage.setItem('appId', encryptID)
      this.router.navigate(['/application-entry','application-details']) 
    }
    if (clickEvent.col && clickEvent.col.displayName === 'All Status') {
    if (clickEvent.name === 'roll') {
      let data = clickEvent.data;
      let encryptID = this.encryptDecryptService.encryptData((data.id).toString())
      sessionStorage.setItem('appId', encryptID)
      let fsIds = clickEvent.data.id;       
      let action = "ROLL_OVER";
      let remarks = '';
      this.closServices.setFsIds(fsIds,action);
      this.router.navigate(['/application-entry/corporate-details']);
      // this.closServices.getRolloverStatus(fsIds,action,'').subscribe(res => {
      //   this.router.navigate(['/application-entry','rollover-listing']) 
      // })
    }
      else if (clickEvent.name === 'extension') 
      {      
      let data = clickEvent.data;
      let encryptID = this.encryptDecryptService.encryptData((data.id).toString())
      sessionStorage.setItem('appId', encryptID)
      let fsIds = clickEvent.data.id;      
      let action = "EXTENSION_OF_LOAN";
      let remarks = '';
      this.closServices.setFsIds(fsIds,action);
      this.router.navigate(['/application-entry/corporate-details']);
      // this.closServices.getExtensionofloanStatus(fsIds,action,'').subscribe(res => {
      //   this.router.navigate(['/application-entry','extension-of-loan']) 
      // })
      }
      else if (clickEvent.name === 'additionalLoan') 
      {      
      let fsIds = clickEvent.data.id;      
      let action = "ADDITIONAL_LOAN";
      let remarks = '';
      console.log('Application ID',fsIds)
      this.closServices.setFsIds(fsIds,action);
      this.router.navigate(['/application-entry','application-details'])
      }
    }
  }
  // EXPORT FUNCTION 
  getApplicationExportList(event: any) {
    if(this.selectedNavigation == 'DRAFT'){
      event.columns.forEach(data =>{
        if(data.fieldName ==  'status'){
          data.searchText = ['DRAFT']
        }
      })
    }
    else if(this.selectedNavigation == 'PENDING'){
      event.columns.forEach(data =>{
        if(data.fieldName ==  'status'){
          data.searchText = ['PENDING']
        }
      })
    }
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



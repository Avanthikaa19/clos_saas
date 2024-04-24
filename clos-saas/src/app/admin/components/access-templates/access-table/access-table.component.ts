import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { _MatTabLinkBase } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { CellClickedEvent, ColDef, GridOptions } from 'ag-grid-community';
import { NotifierService } from 'angular-notifier';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
import { AccessControlData } from 'src/app/app.access';
import { ClickEvent, ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { DownloadDataService, DownloadJob } from '../../users/services/download-data.service';
import { UsersService } from '../../users/services/users.service';
import { AccessTemplate, AccessTemplateFilter, accessTemplatesort, ExportFile, MultiSort } from '../models/AccessTemplate';
import { AccessService } from '../services/access.service';


@Component({
  selector: 'app-access-table',
  templateUrl: './access-table.component.html',
  styleUrls: ['./access-table.component.scss', '../../../../common-styles/table-style.scss']
})
export class AccessTableComponent implements OnInit {
   //New Table Implementation
   accesstemplatecolums: ColumnDefinition[]=[];
   accesstemplatedata:[];
   pageData: PageData;
   loadingItems: boolean=false;
   file: any;
   dataRequest: ExportFile = { filter: new accessTemplatesort()};
   currentUser:any='';
   demovideo:boolean=false;

    // EXPORT

  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;
 
  constructor(
    private http: HttpClient,
    private router: Router,
    private userDataService: UsersService,
    private accessDetailDataService: AccessService,
    private notifierService: NotifierService,
    private authenticationService: JwtAuthenticationService,
    public ac: AccessControlData,
    public encryptDecryptService:EncryptDecryptService,
    private fileDownloadService: DownloadDataService,
    public datepipe: DatePipe,
  ) {

    this.accesstemplatecolums = []
    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
   
    this.accesstemplatecolums = [
      {
        fieldName: "id",
        displayName: "ID",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
        filterDisable:true,
        columnDisable:true,
      },
      {
        fieldName: "name",
        displayName: "Name",
        lockColumn: false,
        sortAsc: null,
        searchText: [],
        isExport:true,
      },
      {
        fieldName: "description",
        displayName: "Description",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport:true,
      },
    
      {
        fieldName: "creator",
        displayName: "Created By",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport:true,
      },
      {
        fieldName: "editor",
        displayName: "Edited By",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport:true,
      },
      {
        fieldName: "created",
        displayName: "Created On",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport:true,
        // dateFormat: "dd MMM yyyy",
      },

      {
        fieldName: "",
        displayName: "Edit Templates",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport:false,
        hideExport:true,
        filterDisable:true
      },
    ];
    
  }

  ngOnInit() {
    this.getAccessTemplateData(this.pageData);
  
  }

  //LISTING FUNCTION

  getAccessTemplateData(pageData: PageData) {
    this.loadingItems = true;
    this.accessDetailDataService.accessTemplateList(this.accesstemplatecolums,this.pageData.currentPage, this.pageData.pageSize).subscribe(res => {
      this.accesstemplatedata = res['data'];
      this.loadingItems=false;
      if(this.accesstemplatedata?.length===0){
        this.demovideo=true;
      }
      console.log(this.accesstemplatecolums)
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }
  getCurrentUser():string{
    if(sessionStorage.getItem(AUTHENTICATED_USER)){
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=this.encryptDecryptService.decryptData(user)}
    return this.currentUser
   }

//  FILTER DROP DOWN FUNCTION 

onApplyFilter(columnDetail: any) {
  this.accessDetailDataService.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
    columnDetail.column.dropDownList = res;
  })
  this.changeColumnData(columnDetail.column)
}

// FILTER  FUNCTIONS

changeColumnData(columnDefinition) {
  this.accesstemplatecolums.forEach(column => {
    if (column.fieldName == columnDefinition.fieldName) {
      column = columnDefinition
    }
  })
}
columnChange(event: ColumnDefinition[]) {
  this.accesstemplatecolums = event;
  this.getAccessTemplateData(this.pageData);
}


 // EXPORT FUNCTION 

 accessTemplateListExport(event: any) {
  this.accessDetailDataService.accessTemplateListExport(event.columns, event.format).subscribe(res => {
    this.currentDownloadJob = res;
    if (this.downloadStatusSubscription) {
      this.downloadStatusSubscription.unsubscribe();
    }
    this.downloadStatusSubscription = timer(0, 2000)
      .pipe(
        switchMap(() => {
          return this.userDataService.getJob(res.id)
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
          this.accessDetailDataService.getFileByJob(res.id).subscribe(
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
  anchor.download = `Manage Access Template`;
  anchor.href = url;
  anchor.click();
}

// EDIT FUNCTIONS
  onItemClicked(clickEvent: ClickEvent) {
      let accessTemplate: AccessTemplate = clickEvent.data as AccessTemplate;
      let encryptAccessTemplate = this.encryptDecryptService.encryptData(JSON.stringify(accessTemplate))
      sessionStorage.setItem('access_data', encryptAccessTemplate);
      this.router.navigateByUrl('admin/admin/access-template/access-detail');
}
}

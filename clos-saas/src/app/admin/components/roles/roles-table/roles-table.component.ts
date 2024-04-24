import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NotifierService } from 'angular-notifier';
import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
//import { ColumnDefinition, PageData } from 'src/app/alert-manager/components/common/data-table/data-table.component';
import { AccessControlData } from 'src/app/app.access';
import { ClickEvent, ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER, JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { DownloadDataService, DownloadJob } from '../../users/services/download-data.service';
import { UsersService } from '../../users/services/users.service';
import { ExportFile, MultiSort, Role, RoleFilter, RolesFilterSort } from '../models/Role';
import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.scss', '../../../../common-styles/table-style.scss']

})
export class RolesTableComponent implements OnInit {

  rolescolumns: ColumnDefinition[];
  rolescolumnsData: [];
  pageData: PageData;
  loadingItems: boolean = false;
  file: any;
  dataRequest: ExportFile = { filter: new RolesFilterSort() };
  // DOWNLOADS - EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;
  demovideo:boolean=false;


  constructor(
    private userDataService: UsersService,
    private roleDataService: RolesService,
    private router: Router,
    public configurationService: ConfigurationService,
    private authenticationService: JwtAuthenticationService,
    private notifierService: NotifierService,
    public ac: AccessControlData,
    public encryptDecryptService: EncryptDecryptService,
    private fileDownloadService: DownloadDataService,
    public datepipe: DatePipe,
  ) {

    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;
    this.rolescolumns = [
      {
        fieldName: "id",
        displayName: "ID",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: false,
        hideExport:true,
        filterDisable: true,
        columnDisable: true,
      },
      {
        fieldName: "name",
        displayName: "Name",
        lockColumn: false,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "description",
        displayName: "Description",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "createdByUser",
        displayName: "Created By",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "created",
        displayName: "Created",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },
      {
        fieldName: "originId",
        displayName: "Origin ID",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
      },

      {
        fieldName: "defaultAccessTemplate",
        subFieldName:"name",
        displayName: "Default Access Template",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: true,
        isList: true,
      },

      {
        fieldName: "",
        displayName: "Edit Roles",
        lockColumn: true,
        sortAsc: null,
        searchText: [],
        isExport: false,
        hideExport: true,
        filterDisable: true
      },


    ];

  }



  ngOnInit() {
    this.getRolesListingeData(this.pageData);
  }


  onAddRoleClick() {
    sessionStorage.removeItem('roles_data');
    this.router.navigateByUrl('admin/admin/roles/role-detail');
  }

  detailClick(clickEvent: ClickEvent) {
    if (clickEvent.col && clickEvent.col.displayName === 'Edit Roles') {
      let role: Role = clickEvent.data as Role;
      let encryptRole = this.encryptDecryptService.encryptData(JSON.stringify(role))
      sessionStorage.setItem('roles_data', encryptRole);
      this.router.navigateByUrl('admin/admin/roles/role-detail');
    }
  }

  //LISTING FUNCTION

  getRolesListingeData(pageData: PageData) {
    this.loadingItems = true;
    this.roleDataService.rolesListingDataList(this.rolescolumns, this.pageData.currentPage, this.pageData.pageSize).subscribe(res => {
      this.rolescolumnsData = res['data'];
      if(this.rolescolumnsData?.length==0){
        this.demovideo=true;
      }
      this.loadingItems = false;
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
    })
  }
  currentUser:any='';
  //GET CURRENT USER
  getCurrentUser():string{
    if(sessionStorage.getItem(AUTHENTICATED_USER)){
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=this.encryptDecryptService.decryptData(user)}
    return this.currentUser
   }


  //  FILTER DROP DOWN FUNCTION 

  onApplyFilter(columnDetail: any) {
    this.roleDataService.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
      columnDetail.column.dropDownList = res;
    })
    this.changeColumnData(columnDetail.column)
  }

  // FILTER  FUNCTIONS

  changeColumnData(columnDefinition) {
    this.rolescolumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }
  columnChange(event: ColumnDefinition[]) {
    this.rolescolumns = event;
    this.getRolesListingeData(this.pageData);
  }




  // EXPORT FUNCTION 

  rolesListDataExport(event: any) {
    this.roleDataService.rolesListExport(event.columns, event.format).subscribe(res => {
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
            this.roleDataService.getFileByJob(res.id).subscribe(
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
    anchor.download = `Manage Roles`;
    anchor.href = url;
    anchor.click();
  }




}

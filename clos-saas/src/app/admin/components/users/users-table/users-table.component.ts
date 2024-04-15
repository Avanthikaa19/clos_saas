import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer, switchMap, catchError, of, filter } from 'rxjs';
import { ClickEvent, ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';
import { ExportFile, User, UsersFilterSort } from '../models/User';
import { DownloadDataService, DownloadJob } from '../services/download-data.service';
import { UsersService } from '../services/users.service';
import { RolesService } from 'src/app/admin/components/roles/services/roles.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

// import { PageEvent } from '@angular/material/paginator';
// import { Sort } from '@angular/material/sort';
// import { Router } from '@angular/router';
// import { ColDef, GridOptions } from 'ag-grid-community';
// import { NotifierService } from 'angular-notifier';
// import { catchError, filter, of, Subscription, switchMap, timer } from 'rxjs';
// import { ColumnDefinition, PageData } from 'src/app/alert-manager/components/common/data-table/data-table.component';
// import { AccessControlData } from 'src/app/app.access';
// import { ConfigurationService } from 'src/app/services/configuration.service';
// import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
// import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
// import { ExportFile, MultiSort, User, UserFilter, UsersFilterSort } from '../models/User';
// import { DownloadDataService, DownloadJob } from '../services/download-data.service';
// import { UsersService } from '../services/users.service';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ManageuserFilterComponent } from './manageuser-filter/manageuser-filter.component';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss', '../../../../common-styles/table-style.scss']

})
export class UsersTableComponent implements OnInit {
  //   //New Table Implementation
  //   columns: ColumnDefinition[];
  //   items: User[];
  //   pageData: PageData;
  //   loadingItems: boolean;
  //   file: any;
  //   dataRequest: ExportFile = { filter: new UsersFilterSort()};
  //   // DOWNLOADS
  //   downloadStatusSubscription: Subscription;
  //   currentDownloadJob: DownloadJob;

  //   //pagnation
  //   totalPagess: number = 0;
  //   pageNum: number = 0;
  //   pageSize: number = 50;
  //   entryCount: number = 0;
  //   pageEvent: PageEvent;
  //   //Global Vars
  //   disableEdit: boolean = false;
  //   loading: boolean = false;


  //   filterColumns: any[] = ["murexId", "id", "ldapid", "username", "firstName", "lastName", "gender", "isLocked", "emailId", "designation", "department", "isSuspended"];
  //   users: User[] = [];
  //   userHeaders: any[] = [];
  //   orderBy: string = 'id';
  //   order: string = "ASC"
  //   selectedUser: User;
  //   filterInput: any = null as any;
  //   filterByMultiSort: UsersFilterSort = new UsersFilterSort();
  //   multiSort: MultiSort[] = [];
  //   multiSorting: any = { name: '', filter: '', order: 'ASC' };
  //   //grid-trial
  //   gridApi: any;
  //   gridOptions = <GridOptions>{};
  //   filterUser: UserFilter = new UserFilter(null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any,null as any,null as any,null as any,null as any,
  //     null as any, null as any, null as any, null as any, null as any, null as any,null as any, null as any, null as any, null, null as any, null as any, null as any,
  //   null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any,null,null as any,null as any);
  //   defaultColDef: ColDef = {
  //     sortable: true,
  //     floatingFilter: true,
  //     filter: true, resizable: true,
  //     editable: true,
  //   };
  //   columnDefs: ColDef[] = [];

  //   constructor(
  //     public dialog: MatDialog,
  //     private userDataService: UsersService,
  //     private router: Router,
  //     public configurationService: ConfigurationService,
  //     private authenticationService: JwtAuthenticationService,
  //     private notifierService: NotifierService,
  //     public ac: AccessControlData,
  //     public encryptDecryptService:EncryptDecryptService,
  //     private fileDownloadService: DownloadDataService,
  //     public datepipe: DatePipe,

  //   ) {  
  //     this.loadingItems = false;
  //     this.ac.items=this.encryptDecryptService.getACItemsFromSession()
  //     this.ac.super=this.encryptDecryptService.getACSuperFromSession()
  //    this.pageData = new PageData();
  //     this.pageData.pageSize = 50;
  //     this.pageData.currentPage = 1;
  //     this.pageData.totalPages = 1;
  //     this.pageData.totalRecords = 0;
  //     this.items = [];
  //     this.dataRequest.filter.filter = this.filterUser;
  //     this.dataRequest.filter.sort = [
  //       {
  //         orderBy: "id",
  //         sortingOrder: "asc",
  //       }
  //     ]
  //     this.columns = [
  //       { 
  //         fieldName: "id",
  //         displayName: "ID",
  //         lockColumn: true,
  //         sortAsc: null,                                                   
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "murexId",
  //         displayName: "murexId",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },

  //       {
  //         fieldName: "username",
  //         displayName: "username",
  //         lockColumn: false,
  //         sortAsc: null,
  //         searchText: "",
  //       },
  //       {
  //         fieldName: "firstName",
  //         displayName: "firstName",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "lastName",
  //         displayName: "lastName",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "birthdate",
  //         displayName: "birthdate",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "gender",
  //         displayName: "gender",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "emailId",
  //         displayName: "emailId",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       { 
  //         fieldName: "emailVerified",
  //         displayName: "emailVerified",
  //         lockColumn: true,
  //         sortAsc: null,                                                   
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "mobileNumber",
  //         displayName: "mobileNumber",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },

  //       {
  //         fieldName: "mobileVerified",
  //         displayName: "mobileVerified",
  //         lockColumn: false,
  //         sortAsc: null,
  //         searchText: "",
  //       },
  //       {
  //         fieldName: "addressLine1",
  //         displayName: "addressLine1",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "addressLine2",
  //         displayName: "addressLine2",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "addressLine3",
  //         displayName: "addressLine3",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "pincode",
  //         displayName: "pincode",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "country",
  //         displayName: "country",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       { 
  //         fieldName: "isLocked",
  //         displayName: "isLocked",
  //         lockColumn: true,
  //         sortAsc: null,                                                   
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "defaultProfileImage",
  //         displayName: "defaultProfileImage",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },

  //       {
  //         fieldName: "profileImage",
  //         displayName: "profileImage",
  //         lockColumn: false,
  //         sortAsc: null,
  //         searchText: "",
  //       },
  //       {
  //         fieldName: "designation",
  //         displayName: "designation",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "failedLogins",
  //         displayName: "failedLogins",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "lastLoginTimestamp",
  //         displayName: "lastLoginTimestamp",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "creator",
  //         displayName: "creator",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "editor",
  //         displayName: "editor",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       { 
  //         fieldName: "settings",
  //         displayName: "settings",
  //         lockColumn: true,
  //         sortAsc: null,                                                   
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "localAccount",
  //         displayName: "localAccount",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },

  //       {
  //         fieldName: "created",
  //         displayName: "created",
  //         lockColumn: false,
  //         sortAsc: null,
  //         searchText: "",
  //       },
  //       {
  //         fieldName: "domain",
  //         displayName: "domain",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "systemDefined",
  //         displayName: "systemDefined",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "groups",
  //         displayName: "groups",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "roles",
  //         displayName: "roles",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       {
  //         fieldName: "isSuspended",
  //         displayName: "isSuspended",
  //         lockColumn: true,
  //         sortAsc: null,
  //         searchText: ""
  //       },
  //       { 
  //         fieldName: "department",
  //         displayName: "department",
  //         lockColumn: true,
  //         sortAsc: null,                                                   
  //         searchText: ""
  //       },

  //     ];
  //     // this.dataRequest.columnDefinitions = this.columns;
  //   }




  //   ngOnInit() {
  //     this.getUsersList();

  //   }

  //   getUsersList(pageNav?: PageEvent) {
  //     this.loading = true;
  //     this.userHeaders = [];
  //     if (pageNav) {
  //       this.pageSize = pageNav.pageSize;
  //       this.pageNum = pageNav.pageIndex;
  //     }
  //     this.userDataService.getUsersList(this.pageNum + 1, this.pageSize).subscribe(
  //       (res) => {
  //         this.loading = false;
  //         console.log(res);
  //         this.users = res.data;
  //         this.totalPagess = res.totalPages;
  //         this.entryCount = res.count;
  //         if (this.users.length > 0) {
  //           delete this.users[0].groups;
  //           let headers: any[] = Object.keys(this.users[0]);
  //           this.createHeaderListByData(headers);
  //         }
  //        // this.showNotification('default', 'Loaded Succcessfully');
  //       },
  //       (err) => {
  //         this.loading = false;
  //         console.log(err);
  //         //this.showNotification('error', 'Whoops! Something went wrong!.');
  //       }
  //     );
  //   }

  //   onCreateBtnClick() {
  //     this.router.navigateByUrl('admin/admin/users/user-detail');
  //     this.userDataService.getUser(new User(null as any, null as any, '', '', '', '', null as any, '', '', '', null as any, '', '', '', '', null as any, '', null, '', '', '',
  //     null as any, '', '', '', '', '', '', '', null as any, [], [],[],null,null as any,null as any,null as any));
  // }

  //   onEditBtnClick() {
  //     if(this.disableEdit){
  //     this.router.navigateByUrl('admin/admin/users/user-detail');
  //     let user = this.getSelectedRow(this.selectedUser);
  //     console.log(user);
  //     this.userDataService.getUser(user);
  //   }}

  //   onDeleteBtnClick() {
  //     if(this.disableEdit){
  //     let user = this.selectedUser.id;
  //     let confirmation = confirm("Are you sure to delete?");
  //     if (confirmation == true) {
  //       this.userDataService.deleteUser(user).subscribe(result => {
  //         this.getUsersList()
  //       }
  //       )
  //     }
  //     this.disableEdit = false;
  //   }}


  //   /*getSelectedRow() {
  //     let selectedNodes = this.gridApi.getSelectedNodes();
  //     let selectedData = selectedNodes.map((node: { data: any; }) => node.data);
  //     // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
  //     return selectedData;
  //   }*/
  //   getSelectedRow(user: User) {
  //     this.selectedUser = user;
  //     console.log('Selected User', this.selectedUser);
  //     this.disableEdit = true;
  //     return this.selectedUser;
  //   }

  //   showNotification(type: string, message: string) {
  //     this.notifierService.notify(type, message);
  //   }

  //   getFilterData(header: any) {
  //     console.log(header);
  //   }

  //   getValues(param) {
  //     if (typeof (param) == 'object') {
  //       if (Array.isArray(param)) {
  //         if (param.length > 1) {
  //           let valueString = param[0].name + '(' + '+' + (param.length - 1) + 'others' + ')';
  //           return valueString;
  //         } else {
  //           if (param.length != 0) {
  //             return param[0].name;
  //           }
  //         }
  //         return "-";
  //       } else {
  //         if (param) {
  //           return param.name;
  //         }
  //         return "-";
  //       }
  //     } else {
  //       return param;
  //     }
  //   }

  //   createHeaderListByData(headers: any) {
  //     this.userHeaders = []
  //     headers.forEach(head => {
  //       let headerData = { name: head, filter: '', order: 'ASC' }
  //       this.userHeaders.push(headerData);
  //     });
  //     console.log('Headers', this.userHeaders);
  //   }

  //   filterChangeEvent(name: any, filterInput: any) {
  //     this.filterColumns.forEach(filterColumn => {
  //       name = name.trim();
  //       if (filterColumn == name) {
  //         this.filterUser[`${name}`] = filterInput
  //       }
  //     })
  //   }

  //   // onApplyFilterBtnClick() {
  //   //   this.userDataService.filterUserTable(this.pageNum + 1, this.pageSize, this.filterUser, this.orderBy, this.order).subscribe(res => {
  //   //     console.log(res);
  //   //     if (res) {
  //   //       this.users = res.data;
  //   //       this.totalPagess = res.totalPages;
  //   //       this.entryCount = res.count;
  //   //       if (this.users.length > 0) {
  //   //         let headers: any[] = Object.keys(this.users[0]);
  //   //         this.createHeaderListByData(headers);
  //   //       }
  //   //     }
  //   //   })
  //   // }

  //   // onApplySortBtnClick(orderName: string, order: string) {
  //   //   console.log(orderName, order);
  //   //   this.orderBy = orderName;
  //   //   if (this.order == 'ASC') {
  //   //     this.order = 'DESC';
  //   //   }
  //   //   else {
  //   //     this.order = 'ASC';
  //   //   }
  //   //   this.onApplyFilterBtnClick();
  //   // }

  //   onSortBtnClick(header) {
  //     this.getDuplicateElement(this.multiSort, header.name);
  //     this.multiSorting = header;
  //     if (this.multiSorting.order == 'ASC') {
  //       this.multiSorting.order = 'DESC'
  //     } else {
  //       this.multiSorting.order = 'ASC'
  //     }
  //     let sorting = new MultiSort();
  //     sorting.orderBy = this.multiSorting.name;
  //     sorting.sortingOrder = this.multiSorting.order;
  //     this.multiSort.push(sorting);
  //     console.log(this.multiSort);
  //     this.getUsersByMultiSortFilter();
  //   }

  //   getDuplicateElement(multiSort, headerName) {
  //     let found: boolean;
  //     console.log(multiSort, headerName)
  //     for (var i = 0; i < multiSort.length; i++) {
  //       if (multiSort[i].orderBy == headerName) {
  //         found = true;
  //         console.log('Found Duplicate Element', i);
  //         this.multiSort.splice(i, 1);
  //         break;
  //       }
  //     }
  //   }

  //   getUsersByMultiSortFilter() {
  //     if(this.users.length>0){
  //     if (this.filterUser.id) {
  //       this.filterUser.id = +this.filterUser.id;
  //     }
  //     this.filterByMultiSort.filter = this.filterUser;
  //     this.filterByMultiSort.sort = this.multiSort;
  //     console.log(this.filterByMultiSort);
  //     this.userDataService.getFiltersByMultiSort(this.filterByMultiSort, this.pageNum + 1, this.pageSize).subscribe(
  //       (res) => {
  //         if (res) {
  //           this.users = res.data;
  //           this.totalPagess = res.totalPages;
  //           this.entryCount = res.count;
  //           //this.showNotification('default', 'Loaded Succcessfully');
  //           // if (this.users.length > 0) {
  //           //   let headers: any[] = Object.keys(this.users[0]);
  //           //   this.createHeaderListByData(headers);
  //           // }
  //         }
  //       },
  //       (err) => {
  //         console.log(err);
  //         //this.showNotification('error', 'Whoops! Something went wrong!.');
  //       }
  //     )
  //   }}

  //   onClearBtnClick() {
  //     this.filterUser = new UserFilter(null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any,
  //       null as any, null as any, null as any, null as any, null as any, null as any,null as any, null as any, null as any, null, null as any, null as any, null as any,null as any,null as any,null as any,null as any,
  //     null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any, null as any,null as any,null as any,null as any);
  //     this.multiSort = [];
  //     // this.getUsersByMultiSortFilter();
  //     this.getUsersList();
  //   }

  //   onExportClick(fileFormat: string) {
  //     this.file = new ExportFile();
  //     this.userDataService.getExportFile(this.dataRequest, fileFormat).subscribe(
  //       (res) => {
  //         this.currentDownloadJob = res;
  //         if (this.downloadStatusSubscription) {
  //           this.downloadStatusSubscription.unsubscribe();
  //         }
  //         // let downloadIntervalSeconds: number = 1
  //         this.downloadStatusSubscription = timer(0, 2000)
  //           .pipe(
  //             switchMap(() => {
  //               return this.fileDownloadService.getJob(res.id)
  //                 .pipe(catchError(err => {
  //                   // Handle errors
  //                   console.error(err);
  //                   return of(undefined);
  //                 }));
  //             }),
  //             filter(data => data !== undefined)
  //           )
  //           .subscribe(data => {
  //             console.log('Updating download status.');
  //             this.currentDownloadJob = data;
  //             if (data.isReady) {
  //               this.downloadStatusSubscription.unsubscribe();
  //               this.currentDownloadJob = null;
  //               //Download file API
  //               this.userDataService.getFileByJob(res.id).subscribe(
  //                 (response: any) => {
  //                   this.downloadFile(response, fileFormat);
  //                   this.notifierService.notify('success', 'Your download should start soon.');
  //                 },
  //                 err => {
  //                   this.notifierService.notify('error', 'Failed to download file. Refer console for more details.');
  //                   console.error(err);
  //                 }
  //               )
  //             }
  //           });
  //       },
  //       (err) => {
  //         console.log(err);
  //         this.notifierService.notify('error', 'Failed to download file. Refer console for more details.');
  //       }
  //     )
  //   }

  //   downloadFile(res, format: string) {
  //     let data = [res];
  //     let date = new Date();
  //     let latest_date = this.datepipe.transform(date, 'yyyyMMdd hhmmss');
  //     if (format == 'xlsx') {
  //       var blob = new Blob(data, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     } else if (format == 'csv') {
  //       var blob = new Blob([res], { type: 'text/csv' });
  //     } else if (format == 'xls') {
  //       var blob = new Blob([res], { type: 'application/vnd.ms-excel' });
  //     } else if (format == 'pdf') {
  //       var blob = new Blob([res], { type: 'application/pdf' });
  //     } else {
  //       var blob = new Blob(data, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     }
  //     var url = window.URL.createObjectURL(blob);
  //     var anchor = document.createElement("a");
  //     anchor.download = `USERS_ITEMS _${latest_date}.${format}`;
  //     anchor.href = url;
  //     anchor.click();
  //   }

  //   // filter dialog
  // openfilterDialog(): void {
  //   const dialogRef = this.dialog.open(ManageuserFilterComponent, {  
  //     // data:id
  //   });
  // }

  userTableColumns: ColumnDefinition[] = [];
  pageData: PageData = new PageData();
  manageUserData: any[];
  loadingItems: boolean;
  roleList: any[];
  roleNames: any;
  selectedUser: User;

  // EXPORT
  downloadStatusSubscription: Subscription;
  currentDownloadJob: DownloadJob;
  file: ExportFile;
  dataRequest: ExportFile = { filter: new UsersFilterSort() };

  constructor(
    private userDataService: UsersService,
    private rolesDataService: RolesService,
    private router: Router,
    public datepipe: DatePipe,
    private defaultService: LoanServiceService,
    private fileDownloadService: DownloadDataService,
    public encryptDecryptService:EncryptDecryptService,

  ) {

    this.loadingItems = false;
    this.pageData = new PageData();
    this.pageData.pageSize = 20;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 0;
    this.pageData.totalRecords = 0;

    this.userTableColumns = [
      {
        fieldName: "id",
        displayName: "ID",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        filterDisable: true,
        columnDisable: true,
        isExport: false,
        hideExport: true
      },
      {
        fieldName: "username",
        displayName: "User Name",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "initial",
        displayName: "Initial",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "firstName",
        displayName: "First Name",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "lastName",
        displayName: "Last Name",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "birthdate",
        displayName: "Birth Date",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "gender",
        displayName: "Gender",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "emailId",
        displayName: "Email Id",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "designation",
        displayName: "Designation",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "supervisingUser",
        displayName: "Supervising User",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "country",
        displayName: "Country",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
      },
      {
        fieldName: "roles",
        subFieldName: "name",
        displayName: "Roles",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: true,
        isList: true,
      },
      {
        fieldName: "",
        displayName: "Edit User",
        lockColumn: false,
        searchText: [],
        sortAsc: null,
        isExport: false,
        hideExport: true,
        filterDisable: true,
      },
    ]
  }

  ngOnInit() {
    this.getManageUserData(this.pageData);
  }
  currentUser:any='';
  //GET CURRENT USER
  getCurrentUser():string{
    if(sessionStorage.getItem(AUTHENTICATED_USER)){
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=this.encryptDecryptService.decryptData(user)}
    return this.currentUser
   }

  //LISTING FUNCTION

  getManageUserData(pageData: PageData) {
    this.loadingItems = true;
    this.userDataService.getManageUsersList(this.userTableColumns, this.pageData.currentPage, this.pageData.pageSize).subscribe(res => {
      this.manageUserData = res['data'];
      this.pageData.count = res['count']
      this.pageData.totalPages = res['count']
      this.loadingItems = false;
    })
  }

  //Add user function

  onAddNewUserClick(event: any) {
    this.router.navigateByUrl('admin/admin/users/user-detail');
    this.userDataService.getUser(new User(null as any, null as any, '', '', '', '', null as any, '', '', '', null as any, '', '', '', '', null as any, '', null, '', '', '',
      null as any, '', '', '', '', '', '', '', null as any, [], [], [], null, null as any, null as any, null as any));
  }


  detailClick(clickEvent: ClickEvent) {

    // Edit User Click 
    if (clickEvent.col && clickEvent.col.displayName === 'Edit User') {
      console.log("checking", clickEvent.data)
      this.selectedUser = clickEvent.data
      // let role: Role = clickEvent.data as Role;
      this.router.navigateByUrl('admin/admin/users/user-detail');
      // let user = this.getSelectedRow(this.selectedUser);
      // console.log(user);
      this.userDataService.getUser(this.selectedUser);
    }
  }

  // getSelectedRow(user: User) {
  //   this.selectedUser = user;
  //   console.log('Selected User', this.selectedUser);
  //   return this.selectedUser;
  // }

  //Filter function

  onApplyFilter(columnDetail: any) {

    if (columnDetail.column.fieldName != 'roles') {
      this.userDataService.getDropdownList(1, 100, columnDetail.column.fieldName, columnDetail.search).subscribe(res => {
        columnDetail.column.dropDownList = res;
      })
    }
    else {
      this.rolesDataService.getDropdownList(1, 100, 'name', columnDetail.search).subscribe(res => {
        columnDetail.column.dropDownList = res;
      })
    }
    this.changeColumnData(columnDetail.column)
  }
  //Funtion to Filter

  changeColumnData(columnDefinition) {
    this.userTableColumns.forEach(column => {
      if (column.fieldName == columnDefinition.fieldName) {
        column = columnDefinition
      }
    })
  }

  columnChange(event: ColumnDefinition[]) {
    this.userTableColumns = event;
    this.getManageUserData(this.pageData)
  }

  // EXPORT FUNCTION fileDownloadService

  getExportList(event: any) {
    this.userDataService.manageUserListExport(event.columns, event.format, this.pageData.currentPage).subscribe(res => {
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
            this.userDataService.getFileByJob(res.id).subscribe(
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
    anchor.download = `Manage Users`;
    anchor.href = url;
    anchor.click();
  }


}


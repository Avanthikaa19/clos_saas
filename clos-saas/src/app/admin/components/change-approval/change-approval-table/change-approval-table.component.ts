import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { ChangeApproval, ChangeApprovalFilter, ChangeApprovalFilterSort, MultiSort } from '../models/ChangeApproval';
import { ChangeApprovalService } from '../services/change-approval.service';

@Component({
  selector: 'app-change-approval-table',
  templateUrl: './change-approval-table.component.html',
  styleUrls: ['./change-approval-table.component.scss']
})
export class ChangeApprovalTableComponent implements OnInit {

  //pagnation
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;
  pageEvent: PageEvent;
  //Global Vars
  disableEdit: boolean = false;
  loading: boolean = false;

  changeApprovalType: string = ""
  changesApproval: ChangeApproval[] = [];
  changeApprovalHeaders: any[] = [];

  filterColumns: any[] = ["id", "type", "tableName"]
  filterInput: any = null as any
  changeApprovalFilter: ChangeApprovalFilter = new ChangeApprovalFilter(null as any, '', '', null as any, null as any, '');
  filterByMultiSort: ChangeApprovalFilterSort = new ChangeApprovalFilterSort();

  orderBy: string = 'id';
  order: string = "ASC"
  multiSort: MultiSort[] = [];
  multiSorting: any = { name: '', filter: '', order: 'ASC' };

  constructor(
    private http: HttpClient,
    private changeApprovalService: ChangeApprovalService,
    private authenticationService: JwtAuthenticationService,
    router: Router,
    private notifierService: NotifierService,
    public encryptDecryptService:EncryptDecryptService,
    public ac: AccessControlData,
  ) {
    console.log(router.routerState.snapshot.url);
    let routeUrl = router.routerState.snapshot.url
    if (routeUrl == '/alerts/change-approval') {
      this.changeApprovalType = 'Alert'
    }
    else {
      this.changeApprovalType = 'Admin'
    }
  }

  ngOnInit(): void {
    this.getChangeApprovalByFilter();
  }
 
  getChangeApprovalByFilter(pageNav?: PageEvent) {
    this.loading = true;
    this.changeApprovalHeaders = [];
    if (pageNav) {
      this.pageSize = pageNav.pageSize;
      this.pageNum = pageNav.pageIndex;
    }
    let defaultFilter = new ChangeApproval();
    defaultFilter.type = this.changeApprovalType,
      this.changeApprovalService.getChangeApprovalByFilter(defaultFilter, this.pageNum, this.pageSize).subscribe(
        (res) => {
          console.log('Change Approval Res', res);
          this.loading = false
          this.changesApproval = res.data;
          this.totalPages = res.totalPages;
          this.entryCount = res.count;
          if (this.changesApproval.length > 0) {
            let headers: any[] = Object.keys(this.changesApproval[0]);
            this.createHeaderListByData(headers);
          }
         // this.showNotification('success', 'Loaded Succcessfully');
        },
        (err) => {
          this.loading = false;
          console.log(err);
         // this.showNotification('error', 'Whoops! Something went wrong!.');
        }
      )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  onApproveClick(changeApprove) {
    if (this.alert() == true) {
      let approve = new ChangeApproval();
      approve.finalizingUser = this.authenticationService.getAuthenticatedUser();
      approve.approved = true;
      this.changeApprovalService.updateChangeApproval(approve, changeApprove.id).subscribe(
        (res) => {
          console.log(res);
          this.getChangeApprovalByFilter();
        },
        (err) => {
          console.log(err);
        }
      )
    } else {

    }
  }

  alert() {
    let text = "Are you sure to approve this request.";
    if (confirm(text) == true) {
      text = "You pressed OK!";
      return true;
    } else {
      text = "You canceled!";
      return false;
    }
  }

  getValues(param) {
    if (typeof (param) == 'object') {
      if (Array.isArray(param)) {
        if (param.length > 1) {
          let valueString = param[0].name + '(' + '+' + (param.length - 1) + 'others' + ')';
          return valueString;
        } else {
          if (param.length != 0) {
            return param[0].name;
          }
        }
        return "-";
      } else {
        if (param) {
          return param.name;
        }
        return "-";
      }
    } else {
      return param;
    }
  }

  createHeaderListByData(headers: any) {
    this.changeApprovalHeaders = []
    headers.forEach(head => {
      let headerData = { name: head, filter: '', order: 'ASC' }
      this.changeApprovalHeaders.push(headerData);
    });
    console.log('Headers', this.changeApprovalHeaders);
  }

  filterChangeEvent(name: any, filterInput: any) {
    this.filterColumns.forEach(filterColumn => {
      name = name.trim();
      if (filterColumn == name) {
        this.changeApprovalFilter[`${name}`] = filterInput
      }
    })
  }

  onSortBtnClick(header) {
    this.getDuplicateElement(this.multiSort, header.name);
    this.multiSorting = header;
    if (this.multiSorting.order == 'ASC') {
      this.multiSorting.order = 'DESC'
    } else {
      this.multiSorting.order = 'ASC'
    }
    let sorting = new MultiSort();
    sorting.orderBy = this.multiSorting.name;
    sorting.sortingOrder = this.multiSorting.order;
    this.multiSort.push(sorting);
    console.log("multisort",this.multiSort);
    this.getChangesApprovalByMultiSortFilter();
  }

  getDuplicateElement(multiSort, headerName) {
    let found: boolean;
    console.log(multiSort, headerName)
    for (var i = 0; i < multiSort.length; i++) {
      if (multiSort[i].orderBy == headerName) {
        found = true;
        console.log('Found Duplicate Element', i);
        this.multiSort.splice(i, 1);
        break;
      }
    }
  }

  getChangesApprovalByMultiSortFilter() {
    if(this.changesApproval.length>0){
    if (this.changeApprovalFilter.id) {
      this.changeApprovalFilter.id = +this.changeApprovalFilter.id;
    }
    this.filterByMultiSort.filters = this.changeApprovalFilter;
    this.filterByMultiSort.sort = this.multiSort;
    console.log("MultiSortFilter",this.filterByMultiSort);
    this.changeApprovalService.getFiltersByMultiSort(this.filterByMultiSort, this.pageNum, this.pageSize).subscribe(
      (res) => {
        if (res) {
          this.changesApproval = res.data;
          this.totalPages = res.totalPages;
          this.entryCount = res.count;
         // this.showNotification('success', 'Loaded Succcessfully');
        }
      },
      (err) => {
        console.log(err);
       // this.showNotification('error', 'Whoops! Something went wrong!.');
      }
    )
  }}

  onClearBtnClick() {
    this.changeApprovalFilter = new ChangeApprovalFilter(null as any, '', '', null as any, null as any, '');
    this.multiSort = [];
    this.getChangeApprovalByFilter();
  }

}

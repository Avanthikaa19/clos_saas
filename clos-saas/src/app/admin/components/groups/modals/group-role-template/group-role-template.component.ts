import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { MultiSort, RoleTemplate, RoleTemplateFilter, RoleTemplateFilterSort } from '../../models/Group';
import { GroupsService } from '../../services/groups.service';
import { RoleTemplateDetailComponent } from './role-template-detail/role-template-detail.component';

@Component({
  selector: 'app-group-role-template',
  templateUrl: './group-role-template.component.html',
  styleUrls: ['./group-role-template.component.scss']
})
export class GroupRoleTemplateComponent implements OnInit {

  //pagnation
  totalPages: number = 0;
  pageNum: number = 0;
  pageSize: number = 50;
  entryCount: number = 0;
  pageEvent: PageEvent;
  //Global Vars
  disableEdit: boolean = false;
  loading: boolean = false;

  groupRoleTemplate: RoleTemplate[] = [];
  roleTemplateHeaders: any[] = [];
  selectedRoleTemplate: RoleTemplate;

  filterRoleTemplate: RoleTemplateFilter = new RoleTemplateFilter(null, null as any, null as any, null as any, null as any);
  orderBy: string = 'id';
  order: string = "ASC"
  filterColumns: any[] = ["id", "name", "description"]
  filterInput: any = null as any
  filterByMultiSort: RoleTemplateFilterSort = new RoleTemplateFilterSort();
  multiSort: MultiSort[] = [];
  multiSorting: any = { name: '', filter: '', order: 'ASC' };

  @Input()
  get roleTemplate() {
    return this.groupRoleTemplate;
  }
  set roleTemplate(val) {
    console.log('Template val', val);
    this.groupRoleTemplate = val;
  }
  constructor(
    private groupDataService: GroupsService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    public ac: AccessControlData,

  ) { }

  ngOnInit(): void {
    this.getRoleTemplates();
  }

  // getRoleTemplates(pageNav?: PageEvent) {
  //   this.loading = true;
  //   this.roleTemplateHeaders = [];
  //   if (pageNav) {
  //     this.pageSize = pageNav.pageSize;
  //     this.pageNum = pageNav.pageIndex;
  //   }
  //   this.groupDataService.getRoleTemplate(this.pageNum + 1, this.pageSize).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.loading = false;
  //       this.groupRoleTemplate = res.data;
  //       this.entryCount = res.count;
  //       this.totalPages = res.totalPages;
  //       this.roleTemplateHeaders = Object.keys(this.groupRoleTemplate[0])
  //     },
  //     (err) => {
  //       this.loading = false;
  //       console.log(err);
  //     }
  //   )
  // }
  getRoleTemplates(pageNav?: PageEvent) {
    this.loading = true;
    this.roleTemplateHeaders = [];
    if (pageNav) {
      this.pageSize = pageNav.pageSize;
      this.pageNum = pageNav.pageIndex;
    }
    this.groupDataService.getRoleTemplate(this.pageNum + 1, this.pageSize).subscribe(
      (res) => {
        this.loading = false;
        console.log(res);
        this.groupRoleTemplate = res.data;
        this.totalPages = res.totalPages;
        this.entryCount = res.count;
        if (this.groupRoleTemplate.length > 0) {
          let headers: any[] = Object.keys(this.groupRoleTemplate[0]);
          this.createHeaderListByData(headers);
         // this.showNotification('default','Loaded successfully.');
        }
      },
      (err) => {
        this.loading = false;
        console.log(err);
       // this.showNotification('error', 'Whoops! something went wrong.');
      }
    );
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
    this.roleTemplateHeaders = []
    headers.forEach(head => {
      let headerData = { name: head, filter: '', order: 'ASC' }
      this.roleTemplateHeaders.push(headerData);
    });
    console.log('Headers', this.roleTemplateHeaders);
  }

  filterChangeEvent(name: any, filterInput: any) {
    this.filterColumns.forEach(filterColumn => {
      name = name.trim();
      if (filterColumn == name) {
        this.filterRoleTemplate[`${name}`] = filterInput
      }
    })
  }

  openAccessTemplate() {
    const dialogRef = this.dialog.open(RoleTemplateDetailComponent, {
      height: '75vh',
      width: '70vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log("result", result);
      if (result) {
        this.getRoleTemplates()
      }
    });
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
    console.log(this.multiSort);
    this.getRoleTemplateByMultiSortFilter();
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

  getRoleTemplateByMultiSortFilter() {
    if(this.groupRoleTemplate.length>0){
    this.filterByMultiSort.filters = this.filterRoleTemplate;
    this.filterByMultiSort.sort = this.multiSort;
    console.log(this.filterByMultiSort);
    this.groupDataService.getRoleTemplateFiltersByMultiSort(this.filterByMultiSort, this.pageNum + 1, this.pageSize).subscribe(
      (res) => {
        if (res) {
          this.groupRoleTemplate = res.data;
          this.totalPages = res.totalPages;
          this.entryCount = res.count;
         // this.showNotification('default','Loaded successfully.');
        }
      },
      (err) => {
        console.log(err);
       //this.showNotification('error','Whoops! something went wrong.');
      }
    )
  }}

  onClearBtnClick() {
    this.filterRoleTemplate = new RoleTemplateFilter(null as any, null as any, null, null, null);
    this.multiSort = [];
    this.getRoleTemplates();
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}

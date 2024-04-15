import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { PageData } from '../../common/share-data-table/share-data-table.component';
import { loanTypeConfig, UserDefinedCustomFields } from '../models/config.models';
import { AddUserDefinedFieldsComponent } from './add-user-defined-fields/add-user-defined-fields.component';

@Component({
  selector: 'app-user-defined-fields',
  templateUrl: './user-defined-fields.component.html',
  styleUrls: ['./user-defined-fields.component.scss']
})
export class UserDefinedFieldsComponent implements OnInit {

  searchTerm: string = '';
  filteredUserDefineList: any[];
  userConfigList: any;
  loading: boolean = false;
  noItemsFound: boolean = false;
  page: number = 1;
  pageData: PageData;
  userCustomFields: UserDefinedCustomFields = new UserDefinedCustomFields();

  constructor(
    public dialog: MatDialog,
    private notifierService: NotifierService,
    public dupliateService: DuplicateCheckingService
  ) {
    // INITIALIZING PAGEDATA
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
  }

  ngOnInit(): void {
    this.getUserConfigDetails();
    this.filteredUserDefineList = this.userConfigList;
  }

  getSearchItem(searchItem: string) {
    this.dupliateService.searchUserDefineConfig(searchItem).subscribe(
      res => {
        this.filteredUserDefineList = res['data'];
      }
    )
  }
  clearSearchItem() {
    this.searchTerm = '';
    this.getSearchItem('');
  }
  onDataSourceSelect(dataSource: any) {
    const dialogRef = this.dialog.open(AddUserDefinedFieldsComponent, {
      // width: '96%', height: '81%', maxWidth: '100vw', 
      data: dataSource
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getUserConfigDetails();
    })
  }
  deleteRules(id) {
    this.dupliateService.deleteUserDefineFields(id).subscribe(
      res => {
        this.showNotification('success', 'Deleted Successfully');
        this.getUserConfigDetails();
      },
      err => {
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('configID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getUserConfigDetails();
  }

  addConfiguration() {
    const dialogRef = this.dialog.open(AddUserDefinedFieldsComponent, {
      width: '115rem', height: '48rem'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getUserConfigDetails();
    })
  }

  // List loan config
  getUserConfigDetails() {
    this.loading = true;
    this.dupliateService.getUserDefine(this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        this.loading = false;
        this.userConfigList = res['data'];
        this.pageData.totalRecords = res['totalElements'];
        this.filteredUserDefineList = this.userConfigList;
      }
    )
  }

}

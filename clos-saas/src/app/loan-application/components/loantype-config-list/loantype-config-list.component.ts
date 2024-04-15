import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { PageData } from '../../common/share-data-table/share-data-table.component';
import { loanTypeConfig } from '../models/config.models';
import { LoantypeConfigDetailsComponent } from './loantype-config-details/loantype-config-details.component';

@Component({
  selector: 'app-loantype-config-list',
  templateUrl: './loantype-config-list.component.html',
  styleUrls: ['./loantype-config-list.component.scss']
})
export class LoantypeConfigListComponent implements OnInit {
  searchTerm: string = '';
  filteredLoanList:any[];
  loanConfigList: any;
  loading: boolean = false;
  noItemsFound: boolean = false;
  page: number = 1;
  pageData: PageData;   
  loanConfig: loanTypeConfig =  new loanTypeConfig('','',null,null,'','','','',null,null,'',null);

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
    this.getLoanConfigDetails();
    this.filteredLoanList = this.loanConfigList;
  }
  getSearchItem(searchItem:string){
    this.dupliateService.searchLoanConfig(searchItem).subscribe(
      res =>
      {
        this.filteredLoanList = res['data'];
      }
    )
  }
  clearSearchItem(){
    this.searchTerm ='';
    this.getSearchItem('');
  }

  onDataSourceSelect(dataSource: any) {
    const dialogRef = this.dialog.open(LoantypeConfigDetailsComponent, {
      // width: '96%', height: '81%', maxWidth: '100vw', 
      data: dataSource
    });
      dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';    
      this.getLoanConfigDetails();
    })
  }
  deleteRules(id) {
  this.dupliateService.deleteLoanConfig(id).subscribe(
    res =>{
      this.showNotification('success', 'Deleted Successfully');
      this.getLoanConfigDetails();
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
    this.getLoanConfigDetails();
  }
 
  addConfiguration(){
    const dialogRef = this.dialog.open(LoantypeConfigDetailsComponent, {
      // width: '120rem', height: '50rem'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getLoanConfigDetails();
    })
  }

  // List loan config
  getLoanConfigDetails(){
    this.loading = true;
    this.dupliateService.getLoanConfig(this.pageData.currentPage, this.pageData.pageSize).subscribe(
    res =>{
        console.log(res);
        this.loading = false;
        this.loanConfigList = res['data'];
        this.pageData.totalRecords = res['totalElements'];
        this.filteredLoanList = this.loanConfigList;
    }
  )
}
}

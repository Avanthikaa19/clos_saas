import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { CreateCurrencyConfigComponent } from './create-currency-config/create-currency-config.component';

@Component({
  selector: 'app-currency-config',
  templateUrl: './currency-config.component.html',
  styleUrls: ['./currency-config.component.scss']
})
export class CurrencyConfigComponent implements OnInit {
  searchTerm: string = '';
  filteredLoanList: any[];
  loanConfigList: any;
  loading: boolean = false;
  noItemsFound: boolean = false;
  page: number = 1;
  pageData: PageData;

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
    this.getCountryList();
  }

  createBasicSetup() {
    const dialogRef = this.dialog.open(CreateCurrencyConfigComponent, {
      width: '120rem', height: '57rem'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getCountryList();

    })
  }

  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('configID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getCountryList();
  }

  deleteCountry(id) {
    this.dupliateService.deleteCountry(id).subscribe(
      res => {
        this.showNotification('success', 'Deleted Successfully');
        this.getCountryList();
      },
      err => {
        this.showNotification('error', 'Oops! something went wrong.');
      }
    )
  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  onDataSourceSelect(dataSource: any) {
    const dialogRef = this.dialog.open(CreateCurrencyConfigComponent, {
      width: '115rem', height: '57rem',
      data: dataSource
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getCountryList();
    })
  }

  // List loan config
  getCountryList() {
    this.loading = true;
    this.dupliateService.getCountryList(this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        console.log(res);
        this.loading = false;
        this.loanConfigList = res['data'];
        this.pageData.totalRecords = res['totalElements'];
        this.filteredLoanList = this.loanConfigList;
      }
    )
  }
  getSearchItem(searchItem:string){
    this.dupliateService.searchCurrencyConfig(searchItem).subscribe(
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
}

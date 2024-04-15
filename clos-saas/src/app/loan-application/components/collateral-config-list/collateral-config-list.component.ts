import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { CollateralConfigDetailComponent } from './collateral-config-detail/collateral-config-detail.component';

@Component({
  selector: 'app-collateral-config-list',
  templateUrl: './collateral-config-list.component.html',
  styleUrls: ['./collateral-config-list.component.scss']
})
export class CollateralConfigListComponent implements OnInit {

  searchTerm: string = '';
  filteredCollateralList: any[];
  collateralConfigList: any;
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
    this.getCollateralConfigList();
  }

  createBasicSetup() {
    const dialogRef = this.dialog.open(CollateralConfigDetailComponent, {
      height: '43rem',
      width: '60rem'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getCollateralConfigList();
    })
  }

  onPageChangeEvent(event: any) {
    const tableID = document.getElementById('configID');
    tableID.scrollIntoView({ block: "start", inline: "start" });
    this.pageData.currentPage = event;
    this.getCollateralConfigList();
  }

  deleteCollateralConfig(id) {
    this.dupliateService.deleteCollateralConfig(id).subscribe(
      res => {
        this.showNotification('success', 'Deleted Successfully');
        this.getCollateralConfigList();
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
    const dialogRef = this.dialog.open(CollateralConfigDetailComponent, {
      height: '40rem',
      width: '60rem',
      data: dataSource
    });
    dialogRef.afterClosed().subscribe(result => {
      this.searchTerm = '';
      this.getCollateralConfigList();
    })
  }

  // List loan config
  getCollateralConfigList() {
    this.loading = true;
    this.dupliateService.getCollateralConfig(this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        this.loading = false;
        this.collateralConfigList = res['data'];
        console.log(this.collateralConfigList)
        this.pageData.totalRecords = res['totalElements'];
        this.filteredCollateralList = this.collateralConfigList;
      }
    )
  }
  getSearchItem(searchItem:string){
    this.dupliateService.searchCollateralConfig(searchItem).subscribe(
      res =>
      {
        this.filteredCollateralList = res['data'];
      }
    )
  }
  clearSearchItem(){
    this.searchTerm ='';
    this.getSearchItem('');
  }
}

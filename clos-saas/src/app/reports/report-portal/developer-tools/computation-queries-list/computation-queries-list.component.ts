import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
// import { UrlService } from 'src/app/services/http/url.service';
import { ComputationQuery } from '../../models/Models';
import { ReportPortalDataService } from '../../services/report-portal-data.service';
import { ComputationQueryDetailComponent } from '../modals/computation-query-detail/computation-query-detail.component';

@Component({
  selector: 'app-computation-queries-list',
  templateUrl: './computation-queries-list.component.html',
  styleUrls: ['./computation-queries-list.component.scss'],
  animations: [ fadeInOut ]
})
export class ComputationQueriesListComponent implements OnInit {

  @ViewChild('creationDiv', {static: false}) private creationDiv: ElementRef<HTMLDivElement>;
  isCreateScrolledIntoView: boolean = true;

  @HostListener('scroll', ['$event'])
  createIsInView(event?) {
    if (this.creationDiv) {
      const rect = this.creationDiv.nativeElement.getBoundingClientRect();
      const topShown = rect.top >= 0;
      const bottomShown = rect.bottom <= window.innerHeight;
      this.isCreateScrolledIntoView = topShown && bottomShown;
    }
  }
  loadingItems: boolean = false;
  computationQueries: ComputationQuery[] = [];

  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalRecords: number = 0;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  nameSearch: string = '';

  constructor(
    // private url: UrlService,
    private reportPortalDataService: ReportPortalDataService,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) {
    this.createIsInView();
  }

  // public updateUrl(): Promise<Object> {
  //   return this.url.getUrl().toPromise();
  // }

  async ngOnInit() {
    // let response = await this.updateUrl();
    // UrlService.API_URL = response.toString();
    // if (UrlService.API_URL.trim().length == 0) {
    //   console.warn('FALLING BACK TO ALTERNATE API URL.');
    //   UrlService.API_URL = UrlService.FALLBACK_API_URL;
    // }
    //init component
    this.refreshItems();
    //TESTING
    // this.openItemDetails(null);
  }

  refreshItems() {
    this.loadingItems = true;
    this.computationQueries = [];
    this.reportPortalDataService.getAllComputationsByPageAndName(this.pageSize, this.currentPage-1, this.nameSearch ? this.nameSearch : ' ').subscribe(
      res => {
        this.loadingItems = false;
        this.totalRecords = res.records;
        this.totalPages = res.totalPages;
        this.computationQueries = res.content;

        //compute page vars
        this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
        this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);

        this.showNotification('default', this.computationQueries.length ? 'Loaded ' + this.computationQueries.length + ' computation queries.' : 'No computation queries found.');
        // TESTING
        // if(this.extractions.length > 0) {
        //   this.openItemDetails(this.extractions[0]);
        // }
      },
      err => {
        this.loadingItems = false;
        console.error(err.error);
      }
    );
  }

  prevPage() {
    if(this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.refreshItems();
  }

  nextPage() {
    if(this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.refreshItems();
  }

  openItemDetails(computationQuery: ComputationQuery) {
    const dialogRef = this.dialog.open(ComputationQueryDetailComponent, {
      width: '1300px',
      panelClass: 'pad-dialog',
      data: { computationQuery: JSON.parse(JSON.stringify(computationQuery)) }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.showNotification('success', result + ' Refreshing list..');
        this.refreshItems();
      }
    });
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

}

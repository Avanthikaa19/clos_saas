import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
// import { UrlService } from 'src/app/services/http/url.service';
import { Report } from '../../models/Models';
import { ReportPortalDataService } from '../../services/report-portal-data.service';
import { ReportPortalDeveloperToolsFeature } from '../developer-tools-feature-interface';
import { ReportsDetailsComponent } from '../modals/reports-details/reports-details.component';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss'],
  animations: [ fadeInOut ]
})
export class ReportsListComponent implements OnInit, ReportPortalDeveloperToolsFeature {

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
  report: Report[] = [];

  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalRecords: number = 1;

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
    this.report = [];
    this.reportPortalDataService.getAllReportsByPageAndName(this.pageSize, this.currentPage-1, this.nameSearch ? this.nameSearch : ' ').subscribe(
      res => {
        this.loadingItems = false;
        this.totalRecords = res.records;
        this.totalPages = res.totalPages;
        this.report = res.content;

        //compute page vars
        this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
        this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);

        this.showNotification('default', this.report.length ? 'Loaded ' + this.report.length + ' reports.' : 'No reports found.');
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

  openItemDetails(report: Report) {
    const dialogRef = this.dialog.open(ReportsDetailsComponent, {
      panelClass: 'no-pad-dialog',
      data: { report: JSON.parse(JSON.stringify(report)) }
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

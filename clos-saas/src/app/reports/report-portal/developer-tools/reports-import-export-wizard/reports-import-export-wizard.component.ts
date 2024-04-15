import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
// import { UrlService } from 'src/app/services/http/url.service';
import { Theme, Layout, exportJson } from '../../models/Models';
import { ReportPortalDataService } from '../../services/report-portal-data.service';
import { ImportExportDetailsComponent } from '../modals/import-export-details/import-export-details.component';

@Component({
  selector: 'app-reports-import-export-wizard',
  templateUrl: './reports-import-export-wizard.component.html',
  styleUrls: ['./reports-import-export-wizard.component.scss'],
  animations: [ fadeInOut ]
})
export class ReportsImportExportWizardComponent implements OnInit {
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
    layouts: Layout[] = [];
    export : exportJson = new exportJson();
  
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
    }

    openItemDetails(exportJson : exportJson) {
      const dialogRef = this.dialog.open(ImportExportDetailsComponent, {
        panelClass: 'no-pad-dialog-full-width',
        width: '1500px',
        data: { exportJson: JSON.parse(JSON.stringify(exportJson)) }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.showNotification('success', result + ' Refreshing list..');
          this.refreshItems();
        }
      });
    }
  
  
    refreshItems() {
      this.loadingItems = true;
      this.layouts = [];
      this.reportPortalDataService.getAllLayoutsByPageAndName(this.pageSize, this.currentPage-1, this.nameSearch ? this.nameSearch : ' ').subscribe(
        res => {
          this.loadingItems = false;
          this.totalRecords = res.records;
          this.totalPages = res.totalPages;
          this.layouts = res.content;
  
          //compute page vars
          this.currentPageStart = ((this.currentPage-1) * this.pageSize)+1;
          this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
  
          this.showNotification('default', this.layouts.length ? 'Loaded ' + this.layouts.length + ' layouts.' : 'No layouts found.');
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
  
  
    showNotification(type: string, message: string) {
      this.notifierService.notify(type, message);
    }
  
}

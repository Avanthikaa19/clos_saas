import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Layout } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
import { Layout } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { UrlService } from 'src/app/services/http/url.service';

@Component({
  selector: 'app-layout-chooser',
  templateUrl: './layout-chooser.component.html',
  styleUrls: ['./layout-chooser.component.scss', '../theme-chooser/theme-chooser.component.scss'],
  animations: [fadeInOut]
})
export class LayoutChooserComponent implements OnInit {

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 1;
  nameSearch: string = '';
  selectedLayout: Layout;


  layouts: Layout[] = [];

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;
  loadingItems: boolean;

  constructor(
    // private url: UrlService,
    public dialogRef: MatDialogRef<LayoutChooserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LayoutChooserComponent,
    private reportPortalDataService: ReportPortalDataService,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) { }

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

    this.getAllLayout();
  }


  getAllLayout() {
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
    this.getAllLayout();
  }

  nextPage() {
    if(this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.getAllLayout();
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }


  onClose(): void {
    this.dialogRef.close();
  }

  onSearchClicked() {
    this.currentPage = 1;
    this.getAllLayout();
  }

  onSelect(layout: Layout): void {
    if(this.selectedLayout){
    this.dialogRef.close(
      {
        layout: layout
      }
    );
  }
  }

}

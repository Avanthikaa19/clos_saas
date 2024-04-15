import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { async } from 'rxjs';
import { fadeInOut } from 'src/app/app.animations';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { ExtractionQuery } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { ExtractionQuery } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';
// import { UrlService } from 'src/app/services/http/url.service';

@Component({
  selector: 'app-extraction-query-chooser',
  templateUrl: './extraction-query-chooser.component.html',
  styleUrls: ['./extraction-query-chooser.component.scss'],
  animations: [ fadeInOut ]
})
export class ExtractionQueryChooserComponent implements OnInit {

  title: string = '';

  propagate: boolean = false;

  loadingItems: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 1;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  nameSearch: string = '';

  extractions: ExtractionQuery[] = [];
  selectedQuery: ExtractionQuery;
  
  constructor(
    // private url: UrlService,
    public dialogRef: MatDialogRef<ExtractionQueryChooserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExtractionQueryChooserComponent,
    private reportPortalDataService: ReportPortalDataService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    private authenticationService: JwtAuthenticationService,
  ) { 
    this.title = data.title;
    this.propagate = data.propagate;
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
    this.extractions = [];
    this.reportPortalDataService.getAllExtractionsByPageAndName(this.pageSize, this.currentPage-1, this.nameSearch ? this.nameSearch : ' ').subscribe(
      res => {
        this.loadingItems = false;
        this.totalRecords = res.records;
        this.totalPages = res.totalPages;
        this.extractions = res.content;

        //compute page vars
        this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
        this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);

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

  onSearchClicked() {
    this.currentPage = 1;
    this.refreshItems();
  }

  onClose(): void {
    this.dialogRef.close();
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

  onSelect(query : ExtractionQuery): void {
    this.dialogRef.close(
      {
        propagate: this.propagate,
        query: query
      }
    );
  }

  select(query: ExtractionQuery, event?) {
    if(event) {
      event.stopPropagation();
    }
    this.selectedQuery = query;
  }

  clearSelection(event?) {
    if(event) {
      event.stopPropagation();
    }
    this.selectedQuery = null;
  }

}

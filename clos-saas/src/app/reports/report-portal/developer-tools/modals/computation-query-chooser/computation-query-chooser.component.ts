import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
import { JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { ComputationQuery, ExtractionQuery } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { ComputationQuery, ExtractionQuery } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { JwtAuthenticationService } from 'src/app/services/authentication/jwt-authentication.service';
// import { UrlService } from 'src/app/services/http/url.service';
import { ExtractionQueryChooserComponent } from '../extraction-query-chooser/extraction-query-chooser.component';

@Component({
  selector: 'app-computation-query-chooser',
  templateUrl: './computation-query-chooser.component.html',
  styleUrls: ['./computation-query-chooser.component.scss', '../extraction-query-chooser/extraction-query-chooser.component.scss'],
  animations: [fadeInOut]
})
export class ComputationQueryChooserComponent implements OnInit {

  loadingItems: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 1;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;

  nameSearch: string = '';

  computations: ComputationQuery[] = [];
  selectedQuery: ComputationQuery;
  
  constructor(
    // private url: UrlService,
    public dialogRef: MatDialogRef<ComputationQueryChooserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ComputationQueryChooserComponent,
    private reportPortalDataService: ReportPortalDataService,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    private authenticationService: JwtAuthenticationService,
  ) { 
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
    this.computations = [];
    this.reportPortalDataService.getAllComputationsByPageAndName(this.pageSize, this.currentPage-1, this.nameSearch ? this.nameSearch : ' ').subscribe(
      res => {
        this.loadingItems = false;
        this.totalRecords = res.records;
        this.totalPages = res.totalPages;
        this.computations = res.content;

        //compute page vars
        this.currentPageStart = ((this.currentPage - 1) * this.pageSize) + 1;
        this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
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

  onSelect(query : ComputationQuery): void {
    this.dialogRef.close(
      {
        query: query
      }
    );
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { interval } from 'rxjs';
// import { UrlService } from 'src/app/services/http/url.service';
import { JobExecution, JobExecutionLog } from '../../models/Models';
import { ReportPortalDataService } from '../../services/report-portal-data.service';

@Component({
  selector: 'app-selected-job-details',
  templateUrl: './selected-job-details.component.html',
  styleUrls: ['./selected-job-details.component.scss']
})
export class SelectedJobDetailsComponent implements OnInit {

  @Input() selectedJobDetail: JobExecution;
  //autorefresh vars
  autoRefreshSub;
  autoRefresh: boolean = true;
  autoRefreshIntervalSeconds: number = 20;
  refreshing: boolean = false;
  loadingItems: boolean;
  jobExecutionLogs: JobExecutionLog[];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalRecords: number = 1;

  constructor(
    // private url: UrlService,
    private reportPortalDataService: ReportPortalDataService
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
      this.refreshData();
       //load backload data & setup auto refresh
        this.autoRefreshSub = interval(this.autoRefreshIntervalSeconds * 1000).subscribe(x => {
          if (this.autoRefresh && !this.refreshing) {
            this.refreshData();
          }
        });
        console.log(`Refreshing feed every ${this.autoRefreshIntervalSeconds} seconds.`);
  }

  //when after refresh checkbox is clicked, do
  autoRefreshOnChange($event) {
    console.log($event);
    this.autoRefresh = $event.checked;
    if (!this.autoRefresh) {
      //unsubscribe
      if (this.autoRefreshSub != null && !this.autoRefreshSub.closed) {
        this.autoRefreshSub.unsubscribe();
      }
    } else {
      //subscribe
      if (this.autoRefreshSub.closed) {
        this.autoRefreshSub = interval(this.autoRefreshIntervalSeconds * 1000).subscribe(x => {
          if (this.autoRefresh && !this.refreshing) {
            this.refreshData();
          }
        });
        console.log(`Refresh ${this.autoRefreshIntervalSeconds} seconds.`);
      }
    }
  }

  refreshData(){
    this.loadingItems = true;
    this.jobExecutionLogs = [];
    this.reportPortalDataService.getExecutionLogs(this.pageSize, this.currentPage-1,this.selectedJobDetail.jobId,[] ).subscribe(
      res => {
        this.loadingItems = false;
        this.totalRecords = res.records;
        this.totalPages = res.totalPages;
        this.jobExecutionLogs = res.content;
        console.log(res);
  
        // //compute page vars
        // this.currentPageStart = this.currentPage;
        // this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
  
        // this.showNotification('default', this.jobExecution.length ? 'Loaded ' + this.jobExecution.length + ' themes.' : 'No themes found.');
      },
      err => {
        this.loadingItems = false;
        console.error(err.error);
      }
    );    
  }

  ngOnChange(){
    this.refreshData();
  }

}

import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
// import { UrlService } from 'src/app/services/http/url.service';
import { JobExecution } from '../models/Models';
import { ReportPortalDataService } from '../services/report-portal-data.service';

@Component({
  selector: 'app-view-all-jobs',
  templateUrl: './view-all-jobs.component.html',
  styleUrls: ['./view-all-jobs.component.scss'],
  animations: [ fadeInOut ]
})
export class ViewAllJobsComponent implements OnInit {
  searchJobs: string;
  sortBy: string;
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalRecords: number = 1;
  selectedJob: JobExecution;

  //computed page vars
  currentPageStart: number = 1;
  currentPageEnd: number = 1;
  loadingItems: boolean;


  constructor(
    // private url: UrlService,
    private reportPortalDataService: ReportPortalDataService,
    private notifierService: NotifierService
  ) {  }

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
    this.refreshItems();
  }

  jobExecution : JobExecution[] = [];

refreshItems() {
  this.loadingItems = true;
  this.jobExecution = [];
  this.reportPortalDataService.getJobByName(this.pageSize, this.currentPage-1, this.searchJobs ? this.searchJobs : ' ').subscribe(
    res => {
      this.loadingItems = false;
      this.totalRecords = res.records;
      this.totalPages = res.totalPages;
      this.jobExecution = res.content;
      this.setBackground();

      //compute page vars
      this.currentPageStart = this.currentPage;
      this.currentPageEnd = (this.currentPage * this.pageSize) > this.totalRecords ? this.totalRecords : (this.currentPage * this.pageSize);
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

setBackground(){
  this.jobExecution.forEach(item =>{
    if(item.endedError == true){
      item.style = "background: linear-gradient(to right, #ff565661 " + item.progress + "%, white 0%);border-left:5px solid #f83939;border-right:5px solid #f83939;transition: background-color 0.5s ease;";
    }else if(item.endedError == false && item.progress!=100){
      item.style = "background: linear-gradient(to right, #90ee905c " + item.progress + "%, white 0%);border-left:5px solid green;border-right:5px solid green;transition: background-color 0.5s ease;";
    }
  });
}

selectedJobinterval(job){
    if(this.selectedJob == job)
      return
    this.selectedJob=null;
    setTimeout(()=> {this.selectedJob = job}, 100)
  }

}

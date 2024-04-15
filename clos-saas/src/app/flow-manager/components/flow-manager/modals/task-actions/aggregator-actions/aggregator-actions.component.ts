import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { BucketStatus } from '../../../models/models-v2';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { BucketStatus } from 'src/app/flow-manager/models/models-v2';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { UrlService } from 'src/app/services/http/url.service';

@Component({
  selector: 'app-aggregator-actions',
  templateUrl: './aggregator-actions.component.html',
  styleUrls: ['./aggregator-actions.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AggregatorActionsComponent implements OnInit {
  thresholdConfig = {
    '0': { color: 'green' },
    '40': { color: 'orange' },
    '75.5': { color: 'red' }
  };
  deadThresholdConfig = {
    '0': { color: 'silver' },
    '40': { color: 'gray' },
    '75.5': { color: 'dimgray' }
  };
  @Input()
  get taskId() {
    return this.tId;
  }
  set taskId(val) {
    this.tId = val;
  }

  loading: boolean = false;
  loadingDead: boolean = false;
  bucketStatuses: BucketStatus[] = [];
  deadBucketStatuses: BucketStatus[] = [];
  tId: number;

  currentLivePage: number = 1;
  livePageSize: number = 20;
  totalLivePages: number = 1;
  totalLiveRecords: number = 0;
  //computed page vars
  currentLivePageStart: number = 1;
  currentLivePageEnd: number = 1;

  currentDeadPage: number = 1;
  deadPageSize: number = 20;
  totalDeadPages: number = 1;
  totalDeadRecords: number = 0;
  //computed page vars
  currentDeadPageStart: number = 1;
  currentDeadPageEnd: number = 1;

  searchLiveBucketString: string = '';
  searchDeadBucketString: string = '';

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    // private url: UrlService
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
    this.refreshLiveStatuses();
    this.refreshDeadStatuses();
    console.log(this.taskId);
  }

  prevLivePage() {
    if(this.currentLivePage <= 1) {
      return;
    }
    this.currentLivePage--;
    this.refreshLiveStatuses();
  }

  nextLivePage() {
    if(this.currentLivePage >= this.totalLivePages) {
      return;
    }
    this.currentLivePage++;
    this.refreshLiveStatuses();
  }

  refreshLiveStatuses() {
    this.loading = true;
    // console.log(this.taskId);
    this.flowManagerDataService.getBucketStatus(this.livePageSize, this.currentLivePage-1, this.taskId, 'N').subscribe(
      res => {
        this.totalLiveRecords = res.records;
        this.totalLivePages = res.totalPages;
        this.bucketStatuses = res.content;
        // console.log(this.bucketStatuses);

        //compute page vars
        this.currentLivePageStart = ((this.currentLivePage-1) * this.livePageSize) + 1;
        this.currentLivePageEnd = (this.currentLivePage * this.livePageSize) > this.totalLiveRecords ? this.totalLiveRecords : (this.currentLivePage * this.livePageSize);

        this.loading = false;
      },
      err => {
        console.error(err);
        this.loading = false;
      }
    );
  }

  prevDeadPage() {
    if(this.currentDeadPage <= 1) {
      return;
    }
    this.currentDeadPage--;
    this.refreshDeadStatuses();
  }

  nextDeadPage() {
    if(this.currentDeadPage >= this.totalDeadPages) {
      return;
    }
    this.currentDeadPage++;
    this.refreshDeadStatuses();
  }

  refreshDeadStatuses() {
    this.loadingDead = true;
    // console.log(this.taskId);
    this.flowManagerDataService.getBucketStatus(this.deadPageSize, this.currentDeadPage-1, this.taskId, 'Y').subscribe(
      res => {
        this.totalDeadRecords = res.records;
        this.totalDeadPages = res.totalPages;
        this.deadBucketStatuses = res.content;
        // console.log(this.deadBucketStatuses);

        //compute page vars
        this.currentDeadPageStart = ((this.currentDeadPage-1) * this.deadPageSize) + 1;
        this.currentDeadPageEnd = (this.currentDeadPage * this.deadPageSize) > this.totalDeadRecords ? this.totalDeadRecords : (this.currentDeadPage * this.deadPageSize);

        this.loadingDead = false;
      },
      err => {
        console.error(err);
        this.loadingDead = false;
      }
    );
  }

}

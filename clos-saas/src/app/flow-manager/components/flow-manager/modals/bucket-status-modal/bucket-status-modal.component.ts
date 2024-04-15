import { Component, OnInit, HostListener, Input } from '@angular/core';
// import { app_header_height } from 'src/app/app.constants';
// import { UrlService } from 'src/app/services/http/url.service';

@Component({
  selector: 'app-bucket-status-modal',
  templateUrl: './bucket-status-modal.component.html',
  styleUrls: ['./bucket-status-modal.component.scss']
})

export class BucketStatusModalComponent implements OnInit {
  component_height: number;
  @HostListener('window:resize', ['$event'])
  updateComponentSize(event?) {
    // this.component_height = window.innerHeight - app_header_height;
  }

  enteredId: number = null;
  taskId: number = null;

  constructor(
    // private url: UrlService
  ) {
    this.updateComponentSize();
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
  }

  setTaskId() {
    this.taskId = null;
    this.taskId = this.enteredId;
  }

}

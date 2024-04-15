import { Component, Input, OnInit } from '@angular/core';
import { Report } from '../../../models/Models';
import { ReportPortalDataService } from '../../../services/report-portal-data.service';
// import { Report } from 'src/app/report-portal/models/Models';
// import { ReportPortalDataService } from 'src/app/report-portal/services/report-portal-data.service';
// import { UrlService } from 'src/app/services/http/url.service';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss']
})
export class ReportCardComponent implements OnInit {
  @Input() report: Report;

  loadingItems: boolean = false;

  constructor(
    // private url: UrlService,
    private reportPortalDataService: ReportPortalDataService
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
    this.getLayout();
    for(let i = 0; i < this.report.sheets.length; i++) {
      this.report.sheets[i].reportCardClipPath = this.getClipPathOf(i, this.report.sheets.length, 80, 100);
      this.report.sheets[i].reportCardClipPathHovered = this.getClipPathOf(i, this.report.sheets.length, 80, 100);
    }
  }

  getLayout(){
    this.loadingItems = true;
    this.report.sheets?.forEach(element => {
      this.reportPortalDataService.getLayout(element.layout).subscribe(
        res => {
          element.selectedLayout = res;
          this.loadingItems = false;
        }, err =>{
          console.log(err.error);
          this.loadingItems = false;
        }
      )
    });
  }

  getClipPathOf(index: number, length: number, cutOffsetYPx: number, middleGapPx: number) {
    if(length === 1 || (length > 1 && index === (length - 1))) {
      return 'none';
    }
    if(length === 2 && index === 0) {
      return 'polygon(0 0, calc(50% + ' + (cutOffsetYPx/2) + 'px) 0, calc(50% - ' + (cutOffsetYPx/2) + 'px) 100%, 0 100%)';
    }
    if(length > 2) {
      let cutTopOffset: number = cutOffsetYPx/2;
      let cutBottomOffset: number = -1 * cutTopOffset;

      let startTopOffset: number = cutTopOffset - (middleGapPx/2);
      let startBottomOffset: number = cutBottomOffset - (middleGapPx/2);

      let actualTopOffset: number = startTopOffset + (index * (middleGapPx/(length - 2)));
      let actualBottomOffset: number = startBottomOffset + (index * (middleGapPx/(length - 2)));

      return 'polygon(0 0, calc(50% + ' + actualTopOffset + 'px) 0, calc(50% + ' + actualBottomOffset + 'px) 100%, 0 100%)';
    }
    return null;
  }

}

import { Component, HostListener, OnInit } from '@angular/core';
import { app_header_height } from 'src/app/decision-engine/config/app.constants';
// import { CrmServiceService } from 'src/app/crm-module/crm-service.service';
// import { UrlService } from 'src/app/services/http/url.service';
// import { app_header_height } from '../../../app.constant';
import { Location } from '@angular/common';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';

@Component({
  selector: 'app-custom-mapping',
  templateUrl: './custom-mapping.component.html',
  styleUrls: ['./custom-mapping.component.scss']
})
export class CustomMappingComponent implements OnInit {
  //Component Height
	component_height!: number;
	@HostListener('window:resize', ['$event'])
	updateComponentSize(event:any) {
	  this.component_height = window.innerHeight - app_header_height;
	}
  menus = [ {title:'Dynamic Dashboard Mapping',icon:'map',path:'dashboard-mapping'}]

  constructor(private url: UrlService,
    private location: Location,
    ) { }

  public updateUrl(): Promise < any > {
    return this.url.getUrl().toPromise();
  }
  
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
  } 
  
  goBack() {
    this.location.back();
  }

}

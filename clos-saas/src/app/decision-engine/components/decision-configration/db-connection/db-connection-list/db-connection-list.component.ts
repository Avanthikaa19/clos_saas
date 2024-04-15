import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectModelList } from '../../../../models/ObjectModel';
import { DataSourceService } from '../../../../services/data-source.service';
import { UrlService } from '../../../../services/http/url.service';
import { ObjectModelService } from '../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-db-connection-list',
  templateUrl: './db-connection-list.component.html',
  styleUrls: ['./db-connection-list.component.scss']
})
export class DbConnectionListComponent implements OnInit {

  objectmodels: ObjectModelList[] = [];
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private url: UrlService,
    private _objectmodels: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    private dbSourceService: DataSourceService,
  ) { }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.getObjectModels();
  }
  
  onSelectClick(card: any){
    this.dbSourceService.saveUpdate = false;
    console.log('OnSelect Clicked',card)
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/db-details/'
    console.log(viewUrl)
    this.router.navigate([viewUrl],  { queryParams: { db_type: card } })
  }

  getObjectModels() {
    this._objectmodels.getDBModellist(1).subscribe(
      (res) => {
        this.objectmodels = res;
        console.log(this.objectmodels)
      }
    )
  }

  onBackClick(){
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/db-connection/'
    console.log(viewUrl)
    this.router.navigate([viewUrl])
  }

  

}

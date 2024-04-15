import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ObjectModelList } from '../../../models/ObjectModel';
import { DataSourceService } from '../../../services/data-source.service';
import { UrlService } from '../../../services/http/url.service';
import { ObjectModelService } from '../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
@Component({
  selector: 'app-db-connection',
  templateUrl: './db-connection.component.html',
  styleUrls: ['./db-connection.component.scss']
})
export class DbConnectionComponent implements OnInit {

  objectmodels: ObjectModelList[] = [];
  mysqlDbList: any = [];
  configId: number = null;
  db_type: string = '';
  loading: boolean = false;
  searchText:string;
  mysqlDbItems:any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private url: UrlService,
    private _objectmodels: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    private dbSourceService: DataSourceService,
    private notifierService: NotifierService,
  ) { this.searchText = '';}

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
    this.getMysqlDataSourceList();

  }

  onSelectClick(){
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/db-list/'
    console.log(viewUrl)
    this.router.navigate([viewUrl])
  }

  getObjectModels() {
    this._objectmodels.getDBModellist(this.selectedProject.selectedProjectId).subscribe(
      (res) => {
        this.objectmodels = res;
        console.log(this.objectmodels)
      }
    )
  }

  onBackClick(){
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t 
    console.log(viewUrl)
    this.router.navigate([viewUrl])
  }

  getMysqlDataSourceList(){
    console.log('Mysql')
    this.loading = true;
    this.dbSourceService.getMysqlList().subscribe(
      (res)=>{
        this.loading = false;
        this.mysqlDbList = res;
        console.log(this.mysqlDbList);
        this.searchDb();
        this.showNotification('default','Loaded successfully.')
      },
      (err)=>{
        this.loading = false;
        console.log(err);
        this.showNotification('error','Oops! something went wrong.')
      }
    )
  }

  onDataSourceSelect(dataSource: any){
    this.dbSourceService.saveUpdate = true;
    this.configId = dataSource.id;
    this.db_type = dataSource.db_type;
    console.log('ConfigId', this.configId);
    console.log('Selected function wrks!',dataSource);
    this.editDataSource();
  }

  editDataSource(){
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = t + '/db-details/'
    console.log(viewUrl)
    this.router.navigate([viewUrl],  { queryParams: { db_type: this.db_type, config_id: this.configId } })
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  searchDb():void{
    if(!this.searchText){
      this.mysqlDbItems = this.mysqlDbList
      return this.mysqlDbItems
    }else{
    this.mysqlDbItems = this.mysqlDbList.filter((item: any) => {
      return item.name.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }
  }

}

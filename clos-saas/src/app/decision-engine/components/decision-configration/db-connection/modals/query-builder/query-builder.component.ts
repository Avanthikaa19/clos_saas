import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { fadeInOut } from 'src/app/app.animations';
import { QueryBuilder } from '../../../../../models/QueryBuilder';
import { queryobj } from '../../../../../components/query-variable/view-query-variable/view-query-variable.component';
import { UrlService } from '../../../../../services/http/url.service';
import { ObjectModelService } from '../../../../../services/Object-model.service';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
  animations: [fadeInOut]
})
export class QueryBuilderComponent implements OnInit {
  raw:boolean=true;
  builder:boolean=false;
  value = 'Clear me';
  queryobj=new queryobj()
  file:File =null as any
  list: any;
  db_queryConfig: QueryBuilder = new QueryBuilder();
  query: any = null;
  tableHeaders: string[] = [];
  outputFields: any[] = [];
  loading: boolean = false;

  editorOptions = {
    theme: 'vs', language: 'sql',
    fontFamily: "Consolas, 'Courier New', monospace",
    fontSize: 14,
    fontLigatures: false,
    colorDecorators: true,
    dragAndDrop: true,
    linkedEditing: true,
    minimap: {
      enabled: true,
    },
    mouseWheelZoom: true,
    showFoldingControls: 'always',
    useTabStops: true,
  };

  constructor(
    private url: UrlService,
    private dbModelService: ObjectModelService,
    private notifierService: NotifierService,
    public dialogRef: MatDialogRef<QueryBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueryBuilderComponent,
  ) { 
    this.list = data;
    this.setConfig();
  }

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
    console.log(this.list);
    
  }

  setConfig(){
    this.db_queryConfig.db_name = this.list.db_name;
    this.db_queryConfig.user = this.list.user;
    this.db_queryConfig.host = this.list.host;
    this.db_queryConfig.password = this.list.password;
    this.db_queryConfig.port = this.list.port;
    this.db_queryConfig.project = this.list.project;
  }

  executeQuery(){
    console.log(this.file)
    this.loading = true;
    this.db_queryConfig.query = this.query;
    console.log(this.db_queryConfig);
    this.queryobj.queryconfig=this.db_queryConfig
   
    this.dbModelService.queryExecutionView(this.db_queryConfig).subscribe(
      (res)=>{
        this.loading = false;
        this.outputFields = res;
        this.tableHeaders = Object.keys(this.outputFields[0]);
        this.showNotification('success','Database connected successfully.')
      },
      (err)=>{
        this.loading = false;
        console.log(err);
        this.showNotification('error','Oops! something went wrong.')
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  onValChange(value: any) {
    if(value=="section1"){
       this.raw=true
       this.builder=false
    }
    else if(value=="section2"){
      this.raw=false
      this.builder=true
    }
}
}

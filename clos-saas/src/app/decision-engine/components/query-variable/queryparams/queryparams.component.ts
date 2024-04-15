import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Datatype } from 'src/app/decision-engine/models/ObjectModel';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { ObjectModelService } from 'src/app/decision-engine/services/Object-model.service';
import { Database, filter, queryParams } from '../models/query';
import { DataSourceService } from '../services/data-source.service';
import { ProjectIdService } from '../services/project-id.service';
import { QueryvariableService } from '../services/queryvariable.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-queryparams',
  templateUrl: './queryparams.component.html',
  styleUrls: ['./queryparams.component.scss']
})
export class QueryparamsComponent implements OnInit {
  symbols:any[]=[{name:"equal to",value:"==",disable:false},{name:"not equal to",value:"!=",disable:false},
  {name:"greater than or equal to",value:">=",disable:true},{name:"less than or equal to",value:"<=",disable:true},
  {name:"greater than",value:">",disable:true},{name:"less than",value:"<",disable:true}];
  types:any[]=["filter","query"];
  mysqlDbList: Database[] = []; 
  columnValues: any[] = [];
  filteredColumns: any[] = [];
  params: Datatype[] = [];
  name: string = '';
  filter:filter;
  // filterArray:any[]=[]
  filterData:any[]=[]
  queryParams:queryParams = new queryParams();
  constructor(
      private url: UrlService,
      private objectModelService: ObjectModelService,
      private router:Router,
      private selectedProject: ProjectIdService,
      private dbSourceService: DataSourceService,
      private queryService: QueryvariableService,
      private route: ActivatedRoute,
      private notifierService: NotifierService,
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<QueryparamsComponent>,
      @Inject(MAT_DIALOG_DATA) public data:QueryparamsComponent
  ) { 
    this.queryParams.filter=this.filterData
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
    this.getMysqlDataSourceList()
    this.getDefaultObject()
    this.queryParams.type="filter"
    if(this.data){
       this.queryParams=this.data
       if(this.queryParams.filter){
         this.filterData=this.queryParams.filter
       }
      //  let new=this.data
    }
  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  getMysqlDataSourceList(){
    console.log('Mysql')
    // this.loading = true;
    this.dbSourceService.getMysqlList().subscribe(
      (res)=>{
        this.mysqlDbList = res;
      },
      (err)=>{
        console.log(err);
      }
    )
  }
  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        let children = res[0].schema.children;
        this.params = children;
        this.params.forEach((val:any)=>{
          this.onValueSelected(val)
        })
        
      
      },
     
    )
  }

  onValueSelected(data: any) {
    data.children.forEach((element: any) => {
    this.columnValues.push(element);
    });
    this.filterColumns("");
  }

  filterColumns(event: any) {
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.columnValues.length; i++) {
      if (this.columnValues[i].name != null) {
        if (this.columnValues[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.columnValues[i]);
        }
      }
    }
  }
  onCreateClick(){
   
      console.log(this.queryParams)
      this.dialogRef.close(this.queryParams);
    
   
  }
  onCloseClick(){

    console.log("on close")
      this.dialogRef.close();
    
  }
  addFilterData(){
    this.filter=new filter()
    this.filter.choosen=false
    this.filterData.push(this.filter) 
    this.queryParams.filter=this.filterData

  }
  removeFilterData(i:any){
    this.queryParams.filter.splice(i,1) 
  }

}

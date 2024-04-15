import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Datatype } from '../../../models/ObjectModel';
import { Profiles, ConfigMethod, Config, ResultConfig, InputTable, OutputTable, Tableconfig, ProfileVariable, ProfileConfig } from '../../../models/ProfileVariable';
import { QueryBuilder } from '../../../models/QueryBuilder';
import { Others } from '../../../models/Variables';
import { DataSourceService } from '../../../services/data-source.service';
import { UrlService } from '../../../services/http/url.service';
import { ObjectModelService } from '../../../services/Object-model.service';
import { ProfileVariableService } from '../../../services/profile-variable.service';
import { DecisionEngineIdService } from '../../../services/decision-engine-id.service';
import { ConfigVariableComponent } from '../../decision-configration/project-variables/modals/config-variable/config-variable.component';

@Component({
  selector: 'app-view-profiling',
  templateUrl: './view-profiling.component.html',
  styleUrls: ['./view-profiling.component.scss']
})
export class ViewProfilingComponent implements OnInit {
pushData:any;
  id: number = null as any;
  pythonCode: Others = new Others();
  profileVariable:ProfileVariable={
    "name": '',
    "description": '',
    "others": null as any,
    "config": new ProfileConfig(),
    "objectModel":null as any,
    "input_table":new InputTable(),
    "output_table":new OutputTable(),
  }
  profileConfig:ProfileConfig={
    'columnFilter':[],
    periodField:'',
    dateField: '',
    profileField:'',
    calc:{
      "operation":'',
      "fun":""
    }
    // FilteredListField:any[];
  };
  outputTable:OutputTable={
    "dbType":'MYSQL',
    "db":null as any,
    "selectTable":'',
    "tableQuery":'',
    "tableName":'',
    "newTableQuery":'',
   "tableConfig":[{
    name:'',
    type:'Varchar',
    size:'50',
   }]
  }
  inputTable:InputTable={
    dbType: 'MYSQL',
    db: null as any,
    selectTable: ''
  }
  loading: boolean = false;
  // configure: ConfigMethod[]=[];
  db_config: QueryBuilder = new QueryBuilder();
periodList:string[]=['Daily','Week','Month','Year']
funList:string[]=['Min','Max','Count','Mean']
  params: Datatype[] = [];
  columnValues: any[] = [];
  filteredColumns: any[] = [];
  selectedColumn:any[] = []
  name: string = '';
  profileName:string = ''
  selectedColumnList: any[] = [];
  addTable:boolean=false;
  databaseList:any[] = [];
  db_typeList:string[] = ['MYSQL',"ELASTIC SEARCH",'ORACLE','SQL LITE','MongoDB','MariaDB','PostgreSQL'];
  db_queryConfig: QueryBuilder = new QueryBuilder();
  tableList:any[] = [];
  tableList1:any[] = [];
  toggleData:boolean = false;
  query:string='';
  tableName:string = '';
  tableConfig:Tableconfig=new Tableconfig();
  // tableConfigArray:Tableconfig[] = [];
  dataTypeList:string[] = ['Varchar','Int','char','Text','Bool','Float','Date','DateTime','Year','Time','Timestamp']
  editorOptions = {
    theme: 'vs-dark', language: 'python',
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
  fileName: string = '';
  code: string = '';
  editorTheme: string[] = ['hc-black', 'vs-dark', 'vs'];
  // toggleData: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private selectedProject: DecisionEngineIdService,
    private objectModelService: ObjectModelService,
    private notifierService: NotifierService,
    private profileService: ProfileVariableService,
    private dbSourceService: DataSourceService,
    private url: UrlService, public dialog: MatDialog,
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
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
    this.variableConfig();
    this.getDefaultObject()
   this.getDatabaseList();

  }

  onThemeChange(theme: string) {
    this.editorOptions = { ...this.editorOptions, theme: theme };
  }
  


getDefaultObject() {
  this.objectModelService.getDefaultObjectModel().subscribe(
    res => {
      if(res){
      console.log(res)
      let children = res[0].schema.children;
      this.params = children;
      console.log(this.params);
      this.name = this.params[0].name;
    }},
    (err) => {
      this.showNotification('error', 'Oops! Something Went Wrong.');
    }
  )
}
onValueSelected(data: any) {
  this.columnValues = data.children;
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
filterSelectedColumns(event: any) {
  console.log("inside filter")
  let searchText: string = event;
  if (searchText == null) {
    searchText = '';
  }
  this.selectedColumn = [];
  for (let i = 0; i < this.profileConfig.columnFilter.length; i++) {
    if (this.profileConfig.columnFilter[i].name != null) {
      if (this.profileConfig.columnFilter[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
        this.selectedColumn.push(this.profileConfig.columnFilter[i]);
      }
    }
  }
}
onSaveClick() {
  this.profileVariable.config=this.profileConfig;
  console.log(this.profileVariable.config);
  let stringfyData = JSON.stringify(this.pythonCode);
  this.profileVariable.others=stringfyData;
  this.profileVariable.input_table=this.inputTable;
  this.profileVariable.output_table=this.outputTable;
  if (this.id == 0) {
    console.log("create")
    this.loading = false;
    this.profileService.createProfile(this.profileVariable).subscribe(
      (res) => { 
    this.loading = false;

        this.showNotification('success','Profiling  created successfully.')
        // this.goBack();
      },
      (err) => {
    this.loading = false;

        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  else{
  this.profileService.updateProfiles(this.profileVariable.id,this.profileVariable).subscribe(data =>{
    console.log(data)
    this.showNotification('success','Profiling  updated Successfully.');

  },
  (err) => {
    this.showNotification('error','Oops! something went wrong.');
  }
  )}

}



pushProfileData(data: any) {
console.log('pushProfileData',data);
console.log('pushProfile', this.profileConfig.columnFilter)
this.selectedColumn= this.profileConfig.columnFilter
let filterData={name:data.name,type:data.type}
this.profileConfig.columnFilter.push(filterData)
console.log('pushProfileData',this.profileConfig);

}

  goBack() {
    let t = this.router.url;
    t = t.substr(0, t.lastIndexOf("/"));
    let s = t.substr(0, t.lastIndexOf("/"));
    let viewUrl = s + '/profile-list';
    this.router.navigateByUrl(viewUrl)
    
  }
  configcreation() {
    console.log(this.profileVariable.config)
  }
  configureProfile(){
   console.log(this.profileVariable)

 const dialog=this.dialog.open(ConfigVariableComponent,{
  width:'105rem',height:'60rem',data:{inputTable:this.profileVariable.input_table,outputTable:this.profileVariable.output_table}
})
dialog.afterClosed().subscribe(config=>{
  if(config){
    this.profileVariable.input_table = config[0]
    this.profileVariable.output_table = config[1]
  }
  
})
  }
  variableConfig() {
    this.loading = true;
    if (this.id == 0) {
      this.profileName="Create"
      // console.log('Create Config');
      this.loading=false;
    
    } else {
      this.profileName="Edit"
      console.log('Edit Config');
      this.profileService.getProfile( this.id).subscribe(
        (res:any) => {  
          console.log(res);
          this.profileVariable = res;
          this.profileConfig=res.config
          this.selectedColumn= this.profileConfig.columnFilter
          this.onValueSelected(this.profileVariable.objectModel)
          
          if(this.profileVariable.input_table){
            this.inputTable = this.profileVariable.input_table
          }
          if(this.profileVariable.output_table){
            this.outputTable = this.profileVariable.output_table
          }
          console.log(this.profileVariable)
          if (this.profileVariable.others) {
            this.pythonCode = JSON.parse(res.others);
            console.log(this.pythonCode)
          } else {
            this.pythonCode = new Others();
            console.log(this.pythonCode)
          }
          this.loading = false;
          this.profileVariable.name = res.name;
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }

saveConfig(){
  console.log(this.profileVariable)
  this.onSaveClick()
}
RunProfile(){
  console.log(this.profileVariable)
  this.profileService.runProfile(this.profileVariable).subscribe(data=>{console.log(data)})
}

addTableClick(){
  this.addTable=true;
} 
showNotification(type: string, message: string) {
 this.notifierService.notify(type, message);
}

configureProflile(){
  let query:string=''
  console.log(this.outputTable.tableConfig)
  let string:string=''
  this.outputTable.tableConfig=this.outputTable.tableConfig
  if(this.outputTable.tableConfig.length>0){
  this.outputTable.tableConfig.forEach(table=>{
    if(table){
      if(table.size==''){
        console.log("empty")
        string=string+" " +table.name + " "+ table.type+','
       }
       else{
      string=string+" " +table.name + " "+ table.type+"("+table.size+")"+','
       }
    }
  })
  string=string.slice(0, -1)
  console.log(string)
  if(this.outputTable.tableName){
    query="CREATE TABLE "+this.outputTable.tableName +"("+string+")"

  }
  console.log(query)
  this.outputTable.newTableQuery=query
  this.db_queryConfig.query=query
  this.tableCreation()
 }
 //  this.profileConfig.tableName=this.tableName
  console.log(this.outputTable, this.inputTable)
//  this.dialogRef.close([this.inputTable, this.outputTable])
}
createTableName() {
  console.log(this.outputTable.tableName)
  let data = " "
  this.outputTable.tableName= this.outputTable.tableName.replace(data, '_')
  console.log(this.outputTable.tableName)
}

getDatabaseList(){
 this.dbSourceService.getMysqlList().subscribe(
   (res)=>{
     if(res.length > 0){
       this.showNotification('default','Database  Listed Successfully.');

     }
     else if(res.length == 0){
       this.showNotification('default','No Data  Found.');

     }
    console.log(res);
    this.databaseList = res
    console.log(this.dataTypeList)
 
},
(err)=>{
 this.showNotification('error','Oops! something went wrong.');

}
)
}

pushTableConfig(){
let config:Tableconfig=new Tableconfig();
this.outputTable.tableConfig.push(config);
console.log(this.outputTable.tableConfig)
}

selectingDatabase(){
  console.log(this.outputTable)
  if( this.inputTable.db){
    this.db_queryConfig=this.inputTable.db
   this.db_queryConfig.query='show tables'
   this.db_queryConfig.project=this.selectedProject.selectedProjectId
    console.log(this.db_queryConfig)
    this.profileService.getTables(this.db_queryConfig).subscribe(
     (res)=>{
       console.log(res);
       this.tableList=Object.values(res)
       this.tableList=this.tableList[0]
       console.log(this.tableList)
     }
     )
  }
  if( this.outputTable.db){
    this.db_queryConfig=this.outputTable.db
   this.db_queryConfig.query='show tables'
   this.db_queryConfig.project=this.selectedProject.selectedProjectId
    console.log(this.db_queryConfig)
    this.profileService.getTables(this.db_queryConfig).subscribe(
     (res)=>{
       console.log(res);
       this.tableList1=Object.values(res)
       this.tableList1=this.tableList1[0]
       console.log(this.tableList1)
     }
     )
  }
}

tableCreation(){
  console.log("tree cre")
 if(this.outputTable.db || this.inputTable.db){
 //  let tableCreate={input:this.inputTable,output:this.outputTable}
    this.profileService.confiigureFlow(this.outputTable).subscribe(
     (res)=>{
       console.log(res);

       if(res=='Sucess'){
         this.showNotification('success','Database Table  created Successfully.');

       }
       else if(res=='Connection'){
   this.showNotification('error','Oops! Connection Failed.');

       } 
       else if(res=='Failure'){
         this.showNotification('error','Oops! something went wrong.');
     
             }
             else if(res=='Table'){
               this.showNotification('default','Table already Exists.');
           
                   }
       
     },
     (err)=>{
   this.showNotification('error','Oops! something went wrong.');
     }
     )
  }
}
}

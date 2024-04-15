import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataSourceService } from '../../../../../services/data-source.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DecisionEngineIdService } from '../../../../../services/decision-engine-id.service';
import {OutputTable,InputTable,Tableconfig,QueryBuilder} from '../../../../../models/ProfileVariable'
import { ProfileVariableService } from '../../../../../services/profile-variable.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-config-variables',
  templateUrl: './config-variables.component.html',
  styleUrls: ['./config-variables.component.scss']
})


export class ConfigVariablesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfigVariablesComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dbSourceService: DataSourceService,
private profileService: ProfileVariableService,
    private notifierService: NotifierService,
    private selectedProject: DecisionEngineIdService,

  ) { 
    console.log(this.data)
    if(this.data.inputTable){
      console.log("data coming",this.data)
      this.inputTable=this.data.inputTable;
    }
    if(this.data.outputTable){
      this.outputTable=this.data.outputTable;
      console.log(this.outputTable,this.inputTable)
      this.tableConfigArray=this.data.outputTable.tableConfig
      console.log(this.tableConfigArray)
    }
    
  }
addTable:boolean=false;
databaseList:any[] = [];
inputTable:InputTable=new InputTable();
outputTable:OutputTable=new OutputTable();
// dbData:any;
db_typeList:string[] = ['MYSQL',"ELASTIC SEARCH",'ORACLE','SQL LITE','MongoDB','MariaDB','PostgreSQL'];
db_queryConfig: QueryBuilder = new QueryBuilder();
tableList:any[] = [];
toggleData:boolean = false;
query:string='';
tableName:string = '';
tableConfig:Tableconfig=new Tableconfig();
tableConfigArray:Tableconfig[] = [];
dataTypeList:string[] = ['Varchar','Int','char','Text','Bool','Float','Date','DateTime','Year','Time','Timestamp']
  ngOnInit(): void {
    this.getDatabaseList()
  }


 addTableClick(){
   this.addTable=true;
 } 
 showNotification(type: string, message: string) {
  this.notifierService.notify(type, message);
}

 configureProflile(){
   let query:string=''
   console.log(this.tableConfigArray)
   let string:string=''
   this.outputTable.tableConfig=this.tableConfigArray
   if(this.tableConfigArray.length>0){
   this.tableConfigArray.forEach(table=>{
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
  this.dialogRef.close([this.inputTable, this.outputTable])
 }
 createTableName() {
  console.log(this.outputTable.tableName)
  let data = "_"
  this.outputTable.tableName = this.outputTable.tableName.replace(data, 'u_')
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
this.tableConfigArray.push(config);
console.log(this.tableConfigArray)
}

 selectingDatabase(){
   console.log(this.outputTable)
   if(this.outputTable.db || this.inputTable.db){
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
 }

 tableCreation(){
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

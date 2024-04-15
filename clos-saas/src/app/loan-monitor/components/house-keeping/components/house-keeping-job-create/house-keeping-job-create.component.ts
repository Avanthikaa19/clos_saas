import { Component, Inject, OnInit } from "@angular/core";
import { HouseKeepingJob, HouseKeepingJobDetails, HouseKeepingJobDropdown, HouseKeepingJobFields } from "../../models/houseKeeping";
import { HouseKeepingService } from "src/app/loan-monitor/service/house-keeping.service";
import { QueryvariableService } from "src/app/decision-engine/components/query-variable/services/queryvariable.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-house-keeping-job-create",
  templateUrl: "./house-keeping-job-create.component.html",
  styleUrls: ["./house-keeping-job-create.component.scss"],
})
export class HouseKeepingJobCreateComponent implements OnInit {
  tableSearchKey:string ='';
  dropDownList:HouseKeepingJobDropdown={databaseName:[],tableName:[],logic:['ARCHIVE','PURGE'],process:['Regular','OneTime'],scheduler:['Daily','Weekly','Monthly','Yearly'],archiveTable:[],method:[]}
  jobCreateFields: HouseKeepingJobDetails[] = [];
  tableList: any = [];
  houseKeepingJobDetail :HouseKeepingJob=new HouseKeepingJob()
  constructor(public houseKeepingService:HouseKeepingService,
    public dialogRef: MatDialogRef<HouseKeepingJobCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public houseKeepingJob: any,
    public queryService :QueryvariableService
    ) {
      if(this.houseKeepingJob?.id){
        this.houseKeepingJobDetail= JSON.parse(JSON.stringify(this.houseKeepingJob))
      }
      else{
        this.resetHouseKeepingJob();
      }
      this.resetHouseKeepingJobDetail();

    }
 
  ngOnInit(): void {
    this.getDatabaseList()
  }
  saveJobDetails(){
    //To update House keeping Job
      console.log("print job",this.houseKeepingJobDetail)
      if(this.houseKeepingJobDetail?.id){
      this.houseKeepingService.updateHouseKeepingJob(this.houseKeepingJobDetail).subscribe(res=>{
        console.log("house keeping update",res)
        this.dialogRef.close();
      })
    }

    //To Create New House keeping Job
    else{
      this.houseKeepingJobDetail.status ='Active'
      console.log("print job",this.houseKeepingJobDetail)
      this.houseKeepingService.createHouseKeepingJob(this.houseKeepingJobDetail).subscribe(res=>{
        console.log("house keeping create",res)
        this.dialogRef.close();
      })
    }
   
  }
  getDatabaseList(){
    this.queryService.getDataBaseName().subscribe(res=>{
        this.dropDownList.databaseName=res;
        if(this.houseKeepingJobDetail.databaseName){
        this.getTablesList();
        }
       })
  }
  getTablesList(){
    this.queryService.getTableName(this.houseKeepingJobDetail.databaseName).subscribe(res=>{
      this.dropDownList.tableName=res;
      this.tableList = res;
     })
  }
  dropDownChange(field:HouseKeepingJobFields){
  // console.log("change happened",field)
  let backupHouseKeepingJob :HouseKeepingJob = JSON.parse(JSON.stringify(this.houseKeepingJobDetail));
  if(field.jobField == "databaseName" ||  field.jobField =="logic" ||field.jobField == "process"){
  console.log("if",field)
        this.resetHouseKeepingJob();
        this.resetHouseKeepingJobDetail();
  if(field.jobField=="databaseName"){
    this.houseKeepingJobDetail.jobName =backupHouseKeepingJob.jobName;
    this.houseKeepingJobDetail.databaseName =backupHouseKeepingJob.databaseName;
    this.getTablesList();
  }
  else if(field.jobField=="logic"){
    this.houseKeepingJobDetail.jobName =backupHouseKeepingJob.jobName;
    this.houseKeepingJobDetail.databaseName =backupHouseKeepingJob.databaseName;
    this.houseKeepingJobDetail.logic =backupHouseKeepingJob.logic; 
    this.houseKeepingJobDetail.tableName =backupHouseKeepingJob.tableName;
  }
  else if(field.jobField =='process'){
    this.houseKeepingJobDetail.jobName =backupHouseKeepingJob.jobName;
    this.houseKeepingJobDetail.databaseName =backupHouseKeepingJob.databaseName;
    this.houseKeepingJobDetail.tableName =backupHouseKeepingJob.tableName;
  this.houseKeepingJobDetail.logic =backupHouseKeepingJob.logic;
  this.houseKeepingJobDetail.process =backupHouseKeepingJob.process;
    if(this.houseKeepingJobDetail.process == 'OneTime'){
    if(this.houseKeepingJobDetail.logic == 'PURGE'){
    this.jobCreateFields[2].houseKeepingJobFields[0].isVisible=true;
    this.jobCreateFields[2].houseKeepingJobFields[1].isVisible=true;
    this.jobCreateFields[3].houseKeepingJobFields[0].isVisible=false;
    this.jobCreateFields[3].houseKeepingJobFields[1].isVisible=false;
      }
      else{
        this.jobCreateFields[2].houseKeepingJobFields[0].isVisible=true;
        this.jobCreateFields[2].houseKeepingJobFields[1].isVisible=true;
        // this.jobCreateFields[3].houseKeepingJobFields[0].isVisible=true;
        // this.jobCreateFields[3].houseKeepingJobFields[1].isVisible=true;
      }
    }
    else if(this.houseKeepingJobDetail.process == 'Regular'){
    this.jobCreateFields[2].houseKeepingJobFields[0].isVisible=false;
    this.jobCreateFields[2].houseKeepingJobFields[1].isVisible=false;
    this.jobCreateFields[2].houseKeepingJobFields[2].isVisible=true; 
    this.jobCreateFields[2].houseKeepingJobFields[3].isVisible=true;
  
    }}
  }
  else{

  }
  }
  resetHouseKeepingJobDetail(){
    this.jobCreateFields=[
      {
        houseKeepingJobFields: [
          { jobLabel: "Choose DataBase", jobType: "select" ,jobField:'databaseName',isVisible:true},
          { jobLabel: "Choose Table", jobType: "select"  ,jobField:'tableName',isVisible:true},
          { jobLabel: "Choose Logic", jobType: "select" ,jobField:'logic' ,isVisible:true},
        ],
      },
      {
        houseKeepingJobFields: [
          { jobLabel: "Choose Process", jobType: "select"  ,jobField:'process',isVisible:true},
        ],
      },
      {
        houseKeepingJobFields: [
          { jobLabel: "Choose DateFrom", jobType: "date"  ,jobField:'dateFrom',isVisible:false},
          { jobLabel: "Choose DateTo", jobType: "date"  ,jobField:'dateTo',isVisible:false},
          { jobLabel: "Schedular", jobType: "select"  ,jobField:'scheduler',isVisible:false},
          { jobLabel: "Start Time", jobType: "time"  ,jobField:'startTime',isVisible:false},
        ],
      },
      {
        houseKeepingJobFields: [
          { jobLabel: "Choose Method", jobType: "select"  ,jobField:'method',isVisible:true},
          { jobLabel: "Choose Archive Table", jobType: "select"  ,jobField:'archiveTable',isVisible:true},
        ],
      },
    ];
  }
  resetHouseKeepingJob(){
    this.houseKeepingJobDetail =new HouseKeepingJob();
  }
   // Filter tables names
   tableOptions( ) {
    const searchQuery = this.tableSearchKey?.toLowerCase();
    this.dropDownList.tableName = this.tableList.filter(option =>
      option.toLowerCase().includes(searchQuery)
    );
    console.log("filtered items",this.dropDownList.tableName)
  }
}

import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { HouseKeepingJobCreateComponent } from '../house-keeping-job-create/house-keeping-job-create.component';
import { HouseKeepingService } from 'src/app/loan-monitor/service/house-keeping.service';
import { ColumnDefinition, PageData } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { HouseKeepingJob } from '../../models/houseKeeping';
import { HouseKeepingFilterComponent } from '../house-keeping-filter/house-keeping-filter.component';
import { HouseKeepingExportComponent } from '../house-keeping-export/house-keeping-export.component';
@Component({
  selector: 'app-house-keeping-landing',
  templateUrl: './house-keeping-landing.component.html',
  styleUrls: ['./house-keeping-landing.component.scss']
})
export class HouseKeepingLandingComponent implements OnInit {
  pageData :PageData =new PageData ()
  houseKeepingJobs : HouseKeepingJob[]=[];
  columns:ColumnDefinition[]=[
    {
      fieldName: "dataBase",
      displayName: "Data Base",
      lockColumn: true,
      sortAsc: null,
      searchText: "",
      isExport: true,
      columnDisable: true,
      dropDownList: [],
      searchItem: [],
    },
    {
      fieldName: "tableName",
      displayName: "Table Name",
      lockColumn: true,
      sortAsc: null,
      searchText: "",
      isExport: true,
      columnDisable: true,
      dropDownList: [],
      searchItem: [],
    },
    {
      fieldName: "logic",
      displayName: "Choose Logic",
      lockColumn: true,
      sortAsc: null,
      searchText: "",
      isExport: true,
      columnDisable: true,
      dropDownList: [],
      searchItem: [],
    },
    {
      fieldName: "process",
      displayName: "Choose Process",
      lockColumn: false,
      sortAsc: null,
      searchText: "",
      isExport: true,
      columnDisable: true,
      dropDownList: [],
      searchItem: [],
    },
    {
      fieldName: "dateFrom",
      displayName: "Choose Date",
      lockColumn: true,
      sortAsc: null,
      searchText: "",
      isExport: true,
      dateFormat: "dd MMM yyyy",
      columnDisable: true,
      dropDownList: [],
      searchItem: [],
    },
    // {
    //   fieldName: "dateTo",
    //   displayName: "Date To",
    //   lockColumn: true,
    //   sortAsc: null,
    //   searchText: "",
    //   isExport: true,
    //   dateFormat: "dd MMM yyyy",
    //   columnDisable: true,
    //   dropDownList: [],
    //   searchItem: [],
    // },
    {
      fieldName: "method",
      displayName: "Choose Method",
      lockColumn: true,
      sortAsc: null,
      searchText: "",
      isExport: true,
      columnDisable: true,
      dropDownList: [],
      searchItem: [],
    },
    {
      fieldName: "archiveTable",
      displayName: "Archive Table",
      lockColumn: true,
      sortAsc: null,
      searchText: "",
      isExport: true,
      filterDisable: true,
      columnDisable: false,
      dropDownList: [],
      searchItem: [],
    },
  ]
  constructor(
    public dialog: MatDialog,
    public houseKeepingService:HouseKeepingService
  ) {
    this.pageData.pageSize=20;
    this.pageData.currentPage =1;
   }
  ngOnInit(): void {
    this.getHouseKeepingJobs()
  }

  openCreateNewJobModal(){[]
    let dialog = this.dialog.open(HouseKeepingJobCreateComponent,{width:"120rem",height:"70rem"});
    dialog.afterClosed().subscribe(res=>{
      this.getHouseKeepingJobs();
    })
  }
  onFilterBtnClick(){
    let dialog = this.dialog.open(HouseKeepingFilterComponent,{width:"50rem",height:"70rem"});
  }
  onClearBtnClick(){

  }
  onExportBtnClick(){
    let dialog = this.dialog.open(HouseKeepingExportComponent,{width:"50rem",height:"70rem"});
  }

  getHouseKeepingJobs(){
    this.houseKeepingService.getAllHouseKeepingJobs(this.pageData.currentPage,this.pageData.pageSize,this.columns).subscribe(res=>{
      console.log("all jobs",res)
      this.houseKeepingJobs=res.data
      this.pageData.count=res.count ;
      this.pageData.totalRecords=res.totalRecords ;
    })
  }
  onPageChangeEvent(event: any) {
    this.pageData.currentPage = event;
    this.getHouseKeepingJobs()
  }
  stopRunJob(jobDetail:HouseKeepingJob){
    if(jobDetail?.status?.toLowerCase()=='active'){
    let alert = confirm("Do you want to DeActivate Job "+jobDetail.jobName)
     if(alert== true){
      jobDetail.status ='Deactive'
      this.houseKeepingService.updateHouseKeepingJob(jobDetail).subscribe(res=>{
      })
     }
    }
    else{
      let alert = confirm("Do you want to Activate Job "+jobDetail.jobName)
     if(alert== true){
      jobDetail.status ='Active'
      this.houseKeepingService.updateHouseKeepingJob(jobDetail).subscribe(res=>{
      })
     }
    }
   
  }
  onCardEditClick(houseKeepingJob:HouseKeepingJob){
    let dialog = this.dialog.open(HouseKeepingJobCreateComponent,{width:"120rem",height:"70rem",data:houseKeepingJob});
    dialog.afterClosed().subscribe(res=>{
      this.getHouseKeepingJobs();
    })
  }

}

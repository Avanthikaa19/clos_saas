import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlowtestService } from '../../../../services/flowtest.service';

export class DestinationData{
  public id: number;
  public type:string;
 
}

export class CombineData{
  public destination: DestinationData;
  public operaton:string;
  public how:string;
  public on:any;
}

@Component({
  selector: 'app-combine-operation-modal',
  templateUrl: './combine-operation-modal.component.html',
  styleUrls: ['./combine-operation-modal.component.scss']
})
export class CombineOperationModalComponent implements OnInit {
combineData:CombineData=new CombineData();
branchData:any[] = [];
  constructor(
    private flowtestService:FlowtestService,
    public dialogRef: MatDialogRef<CombineOperationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { 
    this.flowId=this.data.flow_id;
    this.sourceData=this.data.source;
    this.getDecisionFlowById();

  }
options:any[]=['Merge','Concat','Join']; 
howData:any[]=['inner','outer','left','right'];
sourceData:any=null as any;
flowId:number
  ngOnInit(): void {
    console.log(this.data);
    this.combineData.operaton="Merge"
    this.combineData.how="inner"
    console.log(this.combineData);
    
  }
 clicke(){
  console.log(this.combineData);
  this.dialogRef.close(this.combineData);


 }
 getDecisionFlowById(){
  this.flowtestService.getDefaultDecisionFlow(this.flowId).subscribe(
    flowData => {
      if(flowData){ 
        console.log(flowData);       
        let taskData:any[]=flowData.flowTasks;
        taskData.forEach(task=>{
         if (task.condition_branch &&  this.sourceData.id!=task.id || task.mergeBranch=='YES'){
           this.branchData.push(task)
         }
        })
      }
     },
     )
}
}

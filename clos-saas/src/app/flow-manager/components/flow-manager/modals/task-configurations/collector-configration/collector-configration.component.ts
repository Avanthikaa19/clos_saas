import {Component, EventEmitter, Input, OnInit, Output  } from '@angular/core';
import { FlowManagerDataService } from "../../../services/flow-manager-data.service";
import { FieldMapperConfigFragmentModel } from "../field-mapper-fragment/field-mapper-fragment.component";


@Component({
  selector: 'app-collector-configration',
  templateUrl: './collector-configration.component.html',
  styleUrls: ['./collector-configration.component.scss']
})
export class CollectorConfigrationComponent implements OnInit {
 //two way binding to parent component
 configValue: CollectorConfigModel;
 @Output() configChange = new EventEmitter<any>();

 @Input()
 get config() {
   return this.configValue;
 }
 set config(val) {
   this.configValue = val;
   if(this.configValue) {
     for(let i = 0; i < this.configValue.inputs.length; i++) {
       this.inputChooserData.push(
         {
           workflows: [],
           worksheets: [ this.configValue.inputs[i].worksheetName ],
           loadingWorksheets: false,
           tasks: [ this.configValue.inputs[i].taskName ],
           loadingTasks: false,
           currentWorkflowValueInvalid: false,
           currentWorksheetValueInvalid: false,
           currentTaskValueInvalid: false
         }
       );
       if(this.configValue.inputs[i].workflowName) {
         this.onWorkflowSelected(i);
       }
       if(this.configValue.inputs[i].worksheetName) {
         this.onWorksheetSelected(i);
       }
     }
   }
   this.configChange.emit(this.configValue);
 }

 inputChooserData: InputChooserData[] = [];

 loadingWorkflows: boolean = false;
 workflows: string[] = [];

 constructor(private flowManagerDataService: FlowManagerDataService) { }

 ngOnInit() {
   if (this.config == undefined || this.config == null) {
     this.flowManagerDataService
       .getDefaultConfiguration("COLLECTOR")
       .subscribe(
         (res) => {
           this.config = res;
         },
         (err) => {
           console.error(err.error);
         }
       );
   }
   this.loadWorkflows();
 }

 loadWorkflows() {
   this.loadingWorkflows = true;
   this.flowManagerDataService.getWorkflowNames().subscribe(
     res => {
       this.workflows = res.workflows;
       for(let i = 0; i < this.config.inputs.length; i++) {
         this.inputChooserData[i].currentWorkflowValueInvalid = !this.workflows.includes(this.config.inputs[i].workflowName);
       }
       this.loadingWorkflows = false;
     },
     err => {
       this.workflows = [];
       this.loadingWorkflows = false;
       console.error(err.error);
     }
   );
 }

 onWorkflowSelected(index: number, event?) {
   this.reloadWorksheets(index);
   this.inputChooserData[index].currentWorkflowValueInvalid = false;
 }

 reloadWorksheets(index: number) {
   this.inputChooserData[index].loadingWorksheets = true;
   this.flowManagerDataService.getWorksheetNames(this.config.inputs[index].workflowName).subscribe(
     res => {
       this.inputChooserData[index].worksheets = res.worksheets;
       this.inputChooserData[index].currentWorksheetValueInvalid = (!this.config.inputs[index].worksheetName || !this.inputChooserData[index].worksheets.includes(this.config.inputs[index].worksheetName));
       this.inputChooserData[index].loadingWorksheets = false;
     },
     err => {
       this.inputChooserData[index].worksheets = [];
       this.inputChooserData[index].loadingWorksheets = false;
       console.error(err.error);
     }
   );
 }

 onWorksheetSelected(index: number, event?) {
   this.reloadTasks(index);
   this.inputChooserData[index].currentWorksheetValueInvalid = false;
 }

 reloadTasks(index: number) {
   this.inputChooserData[index].loadingTasks = true;
   this.flowManagerDataService.getTaskNames(this.config.inputs[index].workflowName, this.config.inputs[index].worksheetName).subscribe(
     res => {
       this.inputChooserData[index].tasks = res.tasks;
       this.inputChooserData[index].currentTaskValueInvalid = (!this.config.inputs[index].taskName || !this.inputChooserData[index].tasks.includes(this.config.inputs[index].taskName));
       this.inputChooserData[index].loadingTasks = false;
     },
     err => {
       this.inputChooserData[index].tasks = [];
       this.inputChooserData[index].loadingTasks = false;
       console.error(err.error);
     }
   );
 }

 onTaskSelected(index: number, event?) {
   this.inputChooserData[index].currentTaskValueInvalid = false;
 }

 debug() {
   console.log(this.config);
 }

 trackByIndex(index: number): number {
   return index;
 }

 addInput() {
   this.config.inputs.push(
     {
       workflowName: null,
       worksheetName: null,
       taskName: null,
       taskInstance: 1,
       outputOnInstance: 1
     }
   );
   this.inputChooserData.push(
     {
       workflows: [...this.workflows],
       worksheets: [],
       loadingWorksheets: false,
       tasks: [],
       loadingTasks: false,
       currentWorkflowValueInvalid: true,
       currentWorksheetValueInvalid: true,
       currentTaskValueInvalid: true
     }
   );
 }

 removeInput(index: number) {
   this.config.inputs.splice(index, 1);
   this.inputChooserData.splice(index, 1);
 }

 outputInstanceExistsAlready(instanceToCheck: number): boolean {
   for (let out of this.config.outputs) {
     if (out.instance === instanceToCheck) {
       return true;
     }
   }
   return false;
 }

 addOutput() {
   let outputInstance: number = 1;
   while (this.outputInstanceExistsAlready(outputInstance)) {
     outputInstance++;
   }
   this.config.outputs.push(
     {
       instance: outputInstance,
       fieldMapping: {
         fill: "ALWAYS",
         fieldsAre: "APPENDED",
         definedBy: []
       }
     }
   );
 }

}

export class CollectorConfigModel {
  task: {
    resolutionTimerMs: number,
    stopOnAnyQueueError: boolean
  };
  inputs: {
    workflowName: string,
    worksheetName: string,
    taskName: string,
    taskInstance: number,
    outputOnInstance: number
  }[];
  outputs: {
    instance: number,
    fieldMapping: FieldMapperConfigFragmentModel
  }[];
}

export class InputChooserData {
  public workflows: string[];
  public worksheets: string[];
  loadingWorksheets: boolean;
  public tasks: string[];
  loadingTasks: boolean;
  currentWorkflowValueInvalid: boolean;
  currentWorksheetValueInvalid: boolean;
  currentTaskValueInvalid: boolean;
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DecisionFlow, Scenario } from '../../../../models/DecisionFlow';
import { DecisionFlowService } from '../../../../services/decision-flow.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-create-decision-flow',
  templateUrl: './create-decision-flow.component.html',
  styleUrls: ['./create-decision-flow.component.scss']
})
export class CreateDecisionFlowComponent implements OnInit {
  scenarios: Scenario[] = []
  flowList: DecisionFlow[] = [];
  decisionFlow: DecisionFlow = new DecisionFlow();
  flowData: DecisionFlow = null as any;
  constructor(
    private decisionService: DecisionFlowService,
    private decisionFlowService: DecisionFlowService,
    public dialogRef: MatDialogRef<CreateDecisionFlowComponent>,
    private notifierService: NotifierService,
    private selectedProject: DecisionEngineIdService,
    @Inject(MAT_DIALOG_DATA) public serviceId: any
  ) { }

  ngOnInit(): void {
    //  this.getScenariosList()
     this.getFlowList()
  }
  // getScenariosList(){
  //   this.decisionService.getScenariosList().subscribe(
  //     res =>{
  //       this.scenarios =res
  //     }
  //   )
  // }

  getFlowList() {
    this.decisionFlowService.getListFlows().subscribe(
      res => {
        this.flowList = res;
      }
    )
  }

  createFlowConfig() {
    let filterFlow = this.flowList.filter(flow => flow.name == this.decisionFlow.name)
    console.log("flow", filterFlow)
    if (filterFlow.length > 0) {
      this.showNotification('error', 'Flow Name already exists.')
    }
    else {
      this.decisionService.createDecisionFlow(this.decisionFlow).subscribe(
        res => {
          this.flowData = res;
          this.showNotification('success', 'Created Successfully.')
          let stringData = JSON.stringify(this.flowData);
          // this.dialogRef.close(res);      
          this.onCloseClick();
        },
        (err) => {
          this.showNotification('error', 'Oops! Something Went Wrong.')
        }
      )
    }
  }
  onCloseClick() {
    this.dialogRef.close();
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  errMsg(): any {
    if (!this.decisionFlow.name) {
      return '* Name is a required field'
    }
    return '';
  }

}


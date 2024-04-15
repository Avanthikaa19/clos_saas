import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';

@Component({
  selector: 'app-decision-engine-job-configuration',
  templateUrl: './decision-engine-job-configuration.component.html',
  styleUrls: ['./decision-engine-job-configuration.component.scss']
})
export class DecisionEngineJobConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: DecisionEngineJob = new DecisionEngineJob();
  flowNameList: string[]=[];
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  constructor(
    private flowManagerDataService: FlowManagerDataService
  ) { }

  ngOnInit(): void {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DECISION_FLOW_CREATE_JOB').subscribe(
        res => {
          this.config = res;
        },
        err => {
          console.error(err.error);
        }
      );
    }
    this.getFlowNameList()
  }
getFlowNameList(){
  this.flowManagerDataService.getDecisionFlowNameList().subscribe(res=>{
    this.flowNameList = res
  })
}
  debug() {
    console.log(this.config);
  }

}

export class DecisionEngineJob {
  decisionFlowName: string;
  runDate: Date;
  batchId: number;
  fileName: string;
  numLines: number;
  fromDate:string;
  toDate:string;
  id: string;
}

import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { ScfDataService } from 'src/app/scf/services/scf-data.service';
import { AssignableClassField } from '../../../models/models-v2';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';

@Component({
  selector: 'app-scfdeal-processor-configuration',
  templateUrl: './scfdeal-processor-configuration.component.html',
  styleUrls: ['./scfdeal-processor-configuration.component.scss']
})
export class SCFDealProcessorConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: SCFDealProcessorConfigModel;
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }

  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  loadingStatuses: boolean = false;
  statuses: string[] = [];
  loadingFields: boolean = false;

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    // private scfDataService: ScfDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DEAL_PROCESSOR_SCF').subscribe(
        res => {
          this.config = res;
          this.loadingFields = true;
          this.flowManagerDataService.getSCFProcessorFields().subscribe(
            res => {
              this.config.update = res;
              this.loadingFields = false;
            },
            err => {
              this.loadingFields = false;
            }
          );
        }
      );
    }
    // this.refreshTradeStatusList();
  }

  // refreshTradeStatusList() {
  //   this.loadingStatuses = true;
  //   this.scfDataService.getStatuses().subscribe(
  //     res => {
  //       this.statuses = res;
  //       this.loadingStatuses = false;
  //     },
  //     err => {
  //       this.loadingStatuses = false;
  //     }
  //   );
  // }

  trackByIndex(index: number): number { 
    return index; 
  }

  debug() {
    console.log(this.config);
  }

}

export class SCFDealProcessorConfigModel {
  task: {
    maxThreads: number,
    insertBatchSize: number,
    inputPollingMs: number
  };
  passThrough: boolean;
  timeTrigger: {
    enabled: boolean,
    waitFrom: string,
    waitForSec: number
  };
  rules: {
    strictMatch: boolean,
    match: {
      fieldName: string,
      fieldValue: string
    }[]
  }[];
  update: AssignableClassField[];
}

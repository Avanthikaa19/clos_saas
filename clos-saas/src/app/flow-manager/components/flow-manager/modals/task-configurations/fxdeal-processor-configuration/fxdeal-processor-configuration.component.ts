import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
import { AssignableClassField } from '../../../models/models-v2';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { BdoneDataService } from '../../../../bdone/services/bdone-data.service';

@Component({
  selector: 'app-fxdeal-processor-configuration',
  templateUrl: './fxdeal-processor-configuration.component.html',
  styleUrls: ['./fxdeal-processor-configuration.component.scss']
})
export class FXDealProcessorConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: FXDealProcessorConfigModel;
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
    // private bdoneDataService: BdoneDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DEAL_PROCESSOR_FX').subscribe(
        res => {
          this.config = res;
          this.loadingFields = true;
          this.flowManagerDataService.getFXProcessorFields().subscribe(
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
  //   this.bdoneDataService.getStatuses().subscribe(
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

export class FXDealProcessorConfigModel {
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

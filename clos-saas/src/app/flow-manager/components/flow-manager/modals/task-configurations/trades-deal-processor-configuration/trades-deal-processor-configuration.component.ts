import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssignableClassField } from '../../../models/models-v2';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { AssignableClassField } from 'src/app/flow-manager/models/models-v2';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { TradeDataService } from 'src/app/trades/services/trade-data.service';

@Component({
  selector: 'app-trades-deal-processor-configuration',
  templateUrl: './trades-deal-processor-configuration.component.html',
  styleUrls: ['./trades-deal-processor-configuration.component.scss']
})
export class TradesDealProcessorConfigurationComponent implements OnInit {
  //two way binding to parent component
  configValue: TradesDealProcessorConfigModel;
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
    // private TradeDataService: TradeDataService,
  ) { }

  ngOnInit(): void {
    console.log(this.config)
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DEAL_PROCESSOR_TRADES').subscribe(
        res => {
          this.config = res;
          this.loadingFields = true;
          this.flowManagerDataService.getTradeProcessorFields().subscribe(
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
  //   this.TradeDataService.getStatuses().subscribe(
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
export class TradesDealProcessorConfigModel {
  passThrough: boolean;
  task: {
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number
  };
  update: AssignableClassField[];
  rules: {
    strictMatch: boolean,
    match: {
      fieldName: string,
      fieldValue: string
    }[]
  }[];
  timeTrigger: {
    waitFrom: string,
    waitForSec: number,
    enabled: boolean,
  };
}

import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { PlsDataService } from 'src/app/plselldown/services/pls-data.service';
import { AssignableClassField } from '../../../models/models-v2';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';

@Component({
  selector: 'app-plsdeal-processor-configuration',
  templateUrl: './plsdeal-processor-configuration.component.html',
  styleUrls: ['./plsdeal-processor-configuration.component.scss']
})
export class PLSDealProcessorConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: PLSDealProcessorConfigModel;
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
    // private plsDataService: PlsDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DEAL_PROCESSOR_PLS').subscribe(
        res => {
          this.config = res;
          this.loadingFields = true;
          this.flowManagerDataService.getPLSProcessorFields().subscribe(
            res => {
             this.config.update = res;
             this.loadingFields = false; 
            },
            err => {
              this.loadingFields = false;
            }
          )
        },
        err => {
          console.error(err.error);
        }
      );
    }
    // this.refreshTradeStatusList();  
  }
  

  // refreshTradeStatusList() {
  //   this.loadingStatuses = true;
  //   this.plsDataService.getStatuses().subscribe(
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

export class PLSDealProcessorConfigModel {
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

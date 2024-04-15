import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { PlsDataService } from 'src/app/plselldown/services/pls-data.service';

@Component({
  selector: 'app-plsdata-injector-configuration',
  templateUrl: './plsdata-injector-configuration.component.html',
  styleUrls: ['./plsdata-injector-configuration.component.scss']
})
export class PLSDataInjectorConfigurationComponent implements OnInit {
  options:any = {maxLines: 5000, printMargin: false, useWorker: false};
  //two way binding to parent component
  configValue: PLSDataInjectorConfigModel;
  @Output() configChange = new EventEmitter<any>();
  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }
   //this component variables
   loadingFormulas: boolean = false;
   formulas: string[] = [];
 
   loadingStatuses: boolean = false;
   statuses: string[] = [];

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    // private plsDataService: PlsDataService
  ) { }

  ngOnInit(): void {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DATA_INJECTOR_PLS').subscribe(
        res => {
          console.log(res);
          this.config = res;
        },
        err => {
          console.error(err.error);
        }
      );
    }
    this.refreshFormulasList();
    // this.refreshTradeStatusList();
  }
  trackByIndex(index: number): number {
    return index;
  }

  debug() {
    console.log(this.config);
  }
  refreshFormulasList() {
    this.loadingFormulas = true;
    this.flowManagerDataService.getConfigurationFormulas('FIELD_MAPPER').subscribe(
      res => {
        this.formulas = res;
        this.loadingFormulas = false;
      },
      err => {
        this.loadingFormulas = false;
      }
    );
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

}
export class PLSDataInjectorConfigModel {
  splitToSCFDeals: boolean
  passThrough: boolean
  dealType:string
  task: {
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number
  };
  fieldMapping: {
    insertUpdateTrade: boolean,
    validateTreasuryReference: boolean,
    ignoreDuplicateTrades: boolean,
    updateStatusOnMap: string,
    tradeReconProcedure: string,
    fill: string,
    definedBy: {
      giveAs: string,
      name: string,
      formula: string,
      value: string
    }[],
  };
  tradeInjection: {
    enabled: boolean,
    fetchByStatus: string,
    injectIntoQueueOf: string,
    updateStatusOnInject: string,
    entryFieldMap: {
      id: string,
      gid: string,
      nb: string,
      entryId: string,
      batchId: string,
      amount1: string,
      amount2: string, 
      buySell: string,
      instrument: string,
      portfolio: string,
      counterparty: string,
      sourceSystem: string,
      bookingDate: string,
      valueDate: string,
      systemTimestamp: string,
      status: string,
      calledFrom_to: string,
      channel: string,
      costCentre: string,
      costRate: string, 
      productType: string,
      trader: string,
      rate: string,
      frequency: string
    }
  };
}


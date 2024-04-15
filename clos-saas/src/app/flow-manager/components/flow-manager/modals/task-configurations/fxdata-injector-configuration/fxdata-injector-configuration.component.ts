import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { BdoneDataService } from 'src/app/bdone/services/bdone-data.service';

@Component({
  selector: 'app-fxdata-injector-configuration',
  templateUrl: './fxdata-injector-configuration.component.html',
  styleUrls: ['./fxdata-injector-configuration.component.scss']
})
export class FXDataInjectorConfigurationComponent implements OnInit {
  options:any = {maxLines: 5000, printMargin: false, useWorker: false};
  //two way binding to parent component
  configValue: FXDataInjectorConfigModel;
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
    // private bdoneDataService: BdoneDataService
  ) { 
    //for initializing new var and minimizing older ui/api impact
    if(this.config != undefined && this.config != null && 
      (this.config.tradeInjection.fetchByInterface == undefined || this.config.tradeInjection.fetchByInterface == null)) {
      this.config.tradeInjection.fetchByInterface = "";
    }
  }

  ngOnInit(): void {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DATA_INJECTOR_FX').subscribe(
        res => {
          this.config = res;
          //for initializing new var and minimizing older ui/api impact
          if(this.config.tradeInjection.fetchByInterface == undefined || this.config.tradeInjection.fetchByInterface == null) {
            this.config.tradeInjection.fetchByInterface = "";
          }
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

  debug() {
    console.log(this.config);
  }

}

export class FXDataInjectorConfigModel {
  task: {
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number
  };
  fieldMapping: {
    insertUpdateTrade: boolean,
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
    fetchByTradeType: string,
    fetchByInterface: string,
    injectIntoQueueOf: string,
    updateStatusOnInject: string,
    entryFieldMap: {
      id: string,
      gid: string,
      nb: string,
      entryId: string,
      batchId: string,
      releaserId: string,
      aggregatedId: string,
      amount1: string,
      amount2: string,
      hkdEquivalent: number,
      ccy1: string,
      ccy2: string,
      spotRate: string,
      splitRate: string,
      buySell: string,
      instrument: string,
      portfolio: string,
      counterparty: string,
      sourceSystem: string,
      bookingDate: string,
      valueDate: string,
      systemTimestamp: string,
      bdnInterface: string,
      status: string,
      calledFrom_to: string,
      channel: string,
      costCentre: string,
      costRate: string,
      customerName: string,
      department: string,
      productType: string,
      referralDept: string,
      referralDeptPercent: string,
      rm: string,
      rmCode: string,
      rmDept: string,
      rmDeptPercent: string,
      tradeType: string,
      trader: string,
      treasuryReference: string,
      treasurySales: string,
      tseIndicator: string,
      remarks: string,
      reversal: string
    }
  };
}

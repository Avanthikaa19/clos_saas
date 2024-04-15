import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { ScfDataService } from 'src/app/scf/services/scf-data.service';

@Component({
  selector: 'app-scfdata-injector-configuration',
  templateUrl: './scfdata-injector-configuration.component.html',
  styleUrls: ['./scfdata-injector-configuration.component.scss']
})
export class SCFDataInjectorConfigurationComponent implements OnInit {
  options:any = {maxLines: 5000, printMargin: false, useWorker: false};
  //two way binding to parent component
  configValue: SCFDataInjectorConfigModel;
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
    // private scfDataService: ScfDataService
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DATA_INJECTOR_SCF').subscribe(
        res => {
          this.config = res;
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

  debug() {
    console.log(this.config);
  }
}

export class SCFDataInjectorConfigModel {
  task: {
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number
  };
  fieldMapping: {
    insertUpdateTrade: boolean,
    ignoreDuplicateTrades: boolean,
    reversals: {
      enabled: boolean,
      identifiedUsingFields: string[],
      amountTaken: string,
      linkAggregatorTaskId: number,
      forwardEntryAfterReversal: boolean
    },
    updateStatusOnMap: string,
    fill: string,
    fieldsAre: string,
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
      amount: string,
      payReceive: string,
      comments: string,
      gid: string,
      sourceSystem: string,
      agentShortName: string,
      agentFullName: string,
      nostroLabel: string,
      code: string,
      trader: string,
      valueDate: string,
      legalEntity: string,
      nb: string,
      immediate: string,
      portfolio: string,
      currency: string,
      bookingDate: string,
      id: string,
      batchId: string,
      systemTimestamp: string,
      scfInterface: string,
      tranRefNo: string,
      status: string
    }
  };
}

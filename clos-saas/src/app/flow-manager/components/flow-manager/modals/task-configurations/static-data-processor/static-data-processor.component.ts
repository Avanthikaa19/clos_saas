import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { ScfDataService } from 'src/app/scf/services/scf-data.service';

@Component({
  selector: 'app-static-data-processor',
  templateUrl: './static-data-processor.component.html',
  styleUrls: ['./static-data-processor.component.scss']
})
export class StaticDataProcessorComponent implements OnInit {
//two way binding to parent component
configValue: StaticData;
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
  constructor(
    private flowManagerDataService: FlowManagerDataService,
    // private scfDataService: ScfDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('STATIC_DATA_PROCESSOR').subscribe(
        res => {
          // console.log(res.connection.acknowledgeMode)
          this.config = res;
          
          console.log(this.config);
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
export class StaticData{
  passThrough: boolean;
  actionType: string;
  onExist: string;
  task:{
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number,
    }
  rules: 
      {
        strictMatch: boolean,
        match: 
          {
            fieldName: string,
            fieldValue: string,
          }[],
        update: 
        {
          fieldName: string,
          fieldValue: string,
        }[],
      }[];
    
    entryPortfolioFieldMap: {
      simplePortfolio: string,
      description: string,
      branch: string,
      department: string,
      entity: string,
      combinedPortfolio: string,
      dspLabel: string,
      desc: string,
      depth: number,
      leafId: number,
      leafLabel: string,
      level1: string,
      level2: string,
      level3: string,
      level4: string,
      level5: string,
      portfolioDesk: string,
      level8: string,
      level9: string,
      path: string,
      root: string,
      accur: string,
      accsection: string,
      bkgTrade: string,
      costCenter: number,
      inputBy: string,
      managedBy: string,
      pCenter: number,
      procArea: number,
      prodType: string,
      riskplMx: string,
      trader: string,
      mxId: string,
      tSection: string

    }
    entryHolidayFieldMap: {
      label: string,
      reason: string,
      date: string
    }
    entryTypologyFieldMap: {
      label: string,
      description: string
    }
    entryPartyFieldMap: {
      name: string,
      description: string,
      legalEntity : string,
      parent : string,
      origin : string
    }
    entryInstrumentFieldMap:{
      product: string,
      instrument: string
      }
    entryCurrencyFieldMap: {
        calendar: string,
        label: string,
        fullName :string
      }
  staticData: string 
}

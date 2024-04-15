import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-data-filter-configuration',
  templateUrl: './data-filter-configuration.component.html',
  styleUrls: ['./data-filter-configuration.component.scss']
})
export class DataFilterConfigurationComponent implements OnInit {
  //two way binding to parent component
configValue: Data_Filter;
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
    private flowManagerDataService: FlowManagerDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DATA_FILTER').subscribe(
        res => {
        
          this.config = res;
          
          console.log(this.config);
        },
        err => {
          console.error(err.error);
        }
      );
    }
  }
  trackByIndex(index: number): number {
    return index;
  }
  debug() {
    console.log(this.config);
  }
}

export class Data_Filter
    
  {
    passThrough: boolean
    condition: string
    task: {
        insertBatchSize: number,
        inputPollingMs: number,
        maxThreads: number
    }
    // rules: [
    //     {
    //         match: [
    //             {
    //                 fieldName: string,
    //                 fieldValue: string
    //             }
    //         ]
    //     }
    // ]
    validation: {
        preValidate: boolean
    }
}


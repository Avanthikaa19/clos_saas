import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-file-watcher-md-configuration',
  templateUrl: './file-watcher-md-configuration.component.html',
  styleUrls: ['./file-watcher-md-configuration.component.scss']
})
export class FileWatcherMDConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: FileWatcherMDConfigModel = new FileWatcherMDConfigModel();
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
  //none for now

  constructor(
    private flowManagerDataService: FlowManagerDataService
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('FILE_WATCHER_MD_LOCAL').subscribe(
        res => {
          this.config = res;
          
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
  arraymove(arr, fromIndex, toIndex) {
    if(toIndex==-1) {
      toIndex=0;
    }
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

  getOrdinalIndicator(num) {
    if (num == undefined || num == null || num == '') {
      return '';
    }
    let endChar: string = num.toString().charAt(num.toString().length - 1);
    if (endChar == '1') {
      return 'st';
    } else if (endChar == '2') {
      return 'nd';
    } else if (endChar == '3') {
      return 'rd';
    } else {
      return 'th';
    }
  }

}

export class FileWatcherMDConfigModel {
  task: {
    retainRawData: boolean,
    insertBatchSize: number,
    fileReadDelayMs: number,
    inputPollingMs: number,
    multiThread: boolean,
    tag:string
  };
  paths: {
    watch: string,
    reject: string,
    history: string
  };
  files: {
    general: {
      name: string,
      namePattern: string[]
    },
   
    tabularData: {
      marketData: string,
      fieldDelimiter: string,
      sampleMinutes: number,
      dateIndex: number,
      timeIndex: number,
      askIndex: number,
      bidIndex: number,
      maturityDateIndex: number,
      startDateIndex: number,
      nbDaysIndex: number,
      symbolIndex: number,
      lineIndex: number,
      descriptionIndex:number,
      batchId: string,
     
    }
  };
}

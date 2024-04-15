import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-file-batch-listener-configuration',
  templateUrl: './file-batch-listener-configuration.component.html',
  styleUrls: ['./file-batch-listener-configuration.component.scss']
})
export class FileBatchListenerConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: FileBatchListenerConfigModel = new FileBatchListenerConfigModel();
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
      this.flowManagerDataService.getDefaultConfiguration('FILE_BATCH_LISTENER').subscribe(
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

}

export class FileBatchListenerConfigModel {
  task: {
    insertBatchSize: number,
    batchReadDelayMs: number,
    inputPollingMs: number,
  };
  passThrough : boolean;
  paths: {
    target: string
  };
  validate: {
    tag: string,
    tagEnabled: boolean,
    fileName: string,
    fileNameEnabled: boolean,
    taskId: number,
    taskIdEnabled: boolean;
  };
  files: {
    general: {
      name: string,
      namePattern: string[],
      writeMode: string,
    };
};

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-directory-watcher-configuration',
  templateUrl: './directory-watcher-configuration.component.html',
  styleUrls: ['./directory-watcher-configuration.component.scss']
})
export class DirectoryWatcherConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: DirectoryWatcherConfigModel = new DirectoryWatcherConfigModel();
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.updateReadLineMode();
    this.configChange.emit(this.configValue);
  }

  readLineModes: string[] = [
    'None',
    'Single Line',
    'All Lines'
  ];
  readLineMode: string = 'None';

  //this component variables
  //none for now

  constructor(
    private flowManagerDataService: FlowManagerDataService
  ) { }

  updateReadLineMode() {
    if(this.config && this.config.files && this.config.files.readLine) {
      switch(this.config.files.readLine) {
        case 'ALL': {
          this.readLineMode = 'All Lines';
          break;
        }
        default: {
          if(this.config.files.readLine == 'NONE' || this.config.files.readLine == null || this.config.files.readLine.trim().length == 0) {
            this.readLineMode = 'None';
            console.log('Set to none');
          } else {
            this.readLineMode = 'Single Line';
          }
        }
      }
    }
  }

  onReadlineModeChange() {
    switch(this.readLineMode) {
      case 'None': {
        this.config.files.readLine = 'NONE';
        break;
      }
      case 'Single Line': {
        this.config.files.readLine = '0';
        break;
      }
      case 'All Lines': {
        this.config.files.readLine = 'ALL';
        break;
      }
    }
  }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DIRECTORY_WATCHER_LOCAL').subscribe(
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

export class DirectoryWatcherConfigModel {
  task: {
    insertBatchSize: number,
    inputPollingMs: number
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
    readLine: string
  }
}

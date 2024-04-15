import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-file-writer-configuration',
  templateUrl: './file-writer-configuration.component.html',
  styleUrls: ['./file-writer-configuration.component.scss']
})
export class FileWriterConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: FileWriterConfigModel;
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
  show: boolean = false;
  buttonName: any = 'More Details';

  constructor(
    private flowManagerDataService: FlowManagerDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('FILE_WRITER_LOCAL').subscribe(
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

  toggleFieldsViewLevel() {
    this.show = !this.show;
    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.buttonName = "Less Details";
    else
      this.buttonName = "More Details";
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

}

export class FileWriterConfigModel {
  task: {
    inputPollingMs: number,
    retainWriteData: boolean
  };
  passThrough: boolean;
  paths: {
    target: string
  };
  files: {
    general: {
      name: string,
      namePattern: string[],
      writeMode: string,
      useTempDirectory: boolean,
      moveTimeout: number
    },
    tabularData: {
      writeFieldHeaders: boolean,
      fieldStructure: string,
      fieldIndexes: number[],
      fieldLengths: number[],
      fieldDelimiter: string,
      rootNode: string,
      fields: [
        {
          writeFormat: string,
          name: string,
          writeAsField: string,
          xmlPath: string,
        }
      ]
    }
  };
}
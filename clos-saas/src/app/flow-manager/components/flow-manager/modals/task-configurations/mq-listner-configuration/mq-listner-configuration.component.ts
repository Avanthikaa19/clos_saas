import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-mq-listner-configuration',
  templateUrl: './mq-listner-configuration.component.html',
  styleUrls: ['./mq-listner-configuration.component.scss']
})
export class MqListnerConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: MqListnerConfigModel;
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  mqConfigs: string[] = [];

  constructor(
    private flowManagerDataService: FlowManagerDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('MQ_LISTENER').subscribe(
        res => {
          this.config = res;
        },
        err => {
          console.error(err.error);
        }
      );
    }
    this.flowManagerDataService.getMqConnectionConfigurations().subscribe(
      res => {
        this.mqConfigs = res;
      },
      err => {
        console.log(err.error);
      }
    );
  }

  trackByIndex(index: number): number {
    return index;
  }

  debug() {
    console.log(this.config);
  }

}

export class MqListnerConfigModel {
  task: {
    insertBatchSize: number,
    retainReadData: boolean,
    multiThread: boolean
  };
  connection: {
    mqConfig: string,
    mqHost: string,
    mqPort: string,
    mqQueueName: string,
    mqQueueManager: string,
    mqChannel: string,
    requireAuthentication: boolean,
    mqUserid: string,
    mqPassword: string
  };
  message: {
    tabularData: {
      fieldStructure: string,
      keyFields: string[],
      fieldIndexes: number[],
      fieldLengths: number[],
      fieldDelimiter: string,
      fields: {
        name: string,
        xPath: string,
        xPathSubstitute: string,
        readAs: string
        removeDoubleQuotes: boolean
      }[],
      containsFieldHeaders: boolean
    }
  };
}
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-mq-listener-active-mq-configuration',
  templateUrl: './mq-listener-active-mq-configuration.component.html',
  styleUrls: ['./mq-listener-active-mq-configuration.component.scss']
})
export class MQListenerActiveMQConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: MqListnerActiveMQConfigModel;
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
    private flowManagerDataService: FlowManagerDataService
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('MQ_LISTENER_ACTIVEMQ').subscribe(
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

export class MqListnerActiveMQConfigModel {
  task: {
    insertBatchSize: number,
    retainReadData: boolean,
    multiThread: boolean
  };
  connection: {
    mqConfig: string,
    mqUrlPrefix: string,
    mqHost: string,
    mqPort: string,
    mqQueueName: string,
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

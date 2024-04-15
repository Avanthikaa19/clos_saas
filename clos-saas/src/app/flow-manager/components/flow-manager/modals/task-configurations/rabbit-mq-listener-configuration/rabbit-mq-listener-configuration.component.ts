import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';

@Component({
  selector: 'app-rabbit-mq-listener-configuration',
  templateUrl: './rabbit-mq-listener-configuration.component.html',
  styleUrls: ['./rabbit-mq-listener-configuration.component.scss']
})
export class RabbitMqListenerConfigurationComponent implements OnInit {

  //two way binding to parent component
  configValue: RabbitMqListnerConfigModel;
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

  ngOnInit(): void {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('MQ_LISTENER_RABBITMQ').subscribe(
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


export class RabbitMqListnerConfigModel {
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
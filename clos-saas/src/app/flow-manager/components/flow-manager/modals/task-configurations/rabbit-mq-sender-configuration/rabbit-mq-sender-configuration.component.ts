import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';

@Component({
  selector: 'app-rabbit-mq-sender-configuration',
  templateUrl: './rabbit-mq-sender-configuration.component.html',
  styleUrls: ['./rabbit-mq-sender-configuration.component.scss']
})
export class RabbitMqSenderConfigurationComponent implements OnInit {

  
  //two way binding to parent component
  configValue: RabbitMqSenderConfigModel;
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }
  arraymove(arr, fromIndex, toIndex) {
    if (toIndex == -1) {
      toIndex = 0;
    }
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }


  mqConfigs: string[] = [];

  constructor(
    private flowManagerDataService: FlowManagerDataService
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('MQ_SENDER_RABBITMQ').subscribe(
        res => {
          this.config = res;
          console.log(this.config);
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

export class RabbitMqSenderConfigModel {
  task: {
    insertBatchSize: number,
    retainWriteData: boolean
  };
  passThrough: boolean;
  connection: {
    mqConfig: string,
    mqUrlPrefix: string,
    mqHost: string,
    mqPort: string,
    mqQueueName: string,
    requireAuthentication: boolean,
    mqUserid: string,
    mqPassword: string,
    mqEncoding: string
  };
  message: {
    retryOnSendError: number,
    tabularData: {
      fieldStructure: string,
      fieldIndexes: number[],
      fieldLengths: number[],
      fieldDelimiter: string,
      fields: {
        name: string,
        writeAsField: string,
        writeFormat: string
      }[],
      writeFieldHeaders: boolean
    }
  };
}
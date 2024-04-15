import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-fix-sender-configuration',
  templateUrl: './fix-sender-configuration.component.html',
  styleUrls: ['./fix-sender-configuration.component.scss']
})
export class FixSenderConfigurationComponent implements OnInit {

  configValue: FxSender;
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
      this.flowManagerDataService.getDefaultConfiguration('FIX_SENDER').subscribe(
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
  }
  trackByIndex(index: number): number {
    return index;
  }
  debug() {
    console.log(this.config);
  }
}
export class FxSender{
  task:{
    insertBatchSize: number,
    retainWriteData: boolean,
    multiThread: boolean
    }
  session:{
    targetCompID: string,
    beginString: string,
    senderCompID: string
    }
  connection:{
    reconnectInterval: number,
    startTime: string,
    endTime: string,
    socketConnectPort: string,
    socketConnectHost: string,
    heartBtInt: string
    }
    message:{
      tabularData:{
        fieldTags: number[],
        groupTags: number[],
        msgType: string,
        fields:[
              {
              writeFormat: string,
              name: string,
              writeAsField: string,
              },
              {
                writeFormat: string,
                name: string,
                writeAsField: string,
              },
              {
                writeFormat: string,
                name: string,
                writeAsField: string,
              },
              {
                writeFormat: string,
                name: string,
                writeAsField: string,
              }
        ]
        }
    }

}
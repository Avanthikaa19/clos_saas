import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-fix-listener',
  templateUrl: './fix-listener.component.html',
  styleUrls: ['./fix-listener.component.scss']
})
export class FixListenerComponent implements OnInit {
//two way binding to parent component
configValue: FxListner;
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
      this.flowManagerDataService.getDefaultConfiguration('FIX_LISTENER').subscribe(
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
export class FxListner{
  task:{
    insertBatchSize: number,
    retainReadData: boolean,
    multiThread: boolean
    }
  session:{
    targetCompID: string,
    beginString: string,
    senderCompID: string
    }
  connection:{
    startTime: string,
    reconnectInterval: number,
    endTime: string,
    socketAcceptPort: string,
    socketConnectHost: string
    }
    message:{
      tabularData:{
        keyFields: string[],
        fieldTags: number[],
        groupTags: number[],
        msgType: string,
        fields:[
              {
              name: string,
              readAsFormat: string,
              readAs: string,
              required: boolean
              },
              {
              name: string,
              readAsFormat: string,
              readAs: string,
              required: boolean
              },
              {
              name: string,
              readAsFormat: string,
              readAs: string,
              required: boolean
              },
              {
              name: string,
              readAsFormat: string,
              readAs: string,
              required: boolean
              }
        ]
        },
        acknowledgeOnRead: boolean
    }

}
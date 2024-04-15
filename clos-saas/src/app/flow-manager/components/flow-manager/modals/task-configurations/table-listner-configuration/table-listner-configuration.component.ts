import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';


@Component({
  selector: 'app-table-listner-configuration',
  templateUrl: './table-listner-configuration.component.html',
  styleUrls: ['./table-listner-configuration.component.scss']
})
export class TableListnerConfigurationComponent implements OnInit {
//two way binding to parent component
configValue: TaskListner;
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
      this.flowManagerDataService.getDefaultConfiguration('TABLE_LISTENER').subscribe(
        res => {
          // console.log(res.connection.acknowledgeMode)
          this.config = res;
          
          console.log(this.config);
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
export class TaskListner{
  task: {
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number
}
  query: string
  connection: {
    password: string,
    driver: string,
    user: string,
    url: string
}
  tableName: string
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-command-executor-configuration',
  templateUrl: './command-executor-configuration.component.html',
  styleUrls: ['./command-executor-configuration.component.scss']
})
export class CommandExecutorConfigurationComponent implements OnInit {
  status: CommandExecuterConfigModel;
//two way binding to parent component
configValue: CommandExecuterConfigModel;
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
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    console.log(this.config)
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('COMMAND_EXECUTOR').subscribe(
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
export class CommandExecuterConfigModel {
  task: {
    maxThreads: number,
    insertBatchSize: number,
    inputPollingMs: number
  }
  commands: {
    order: number,
    mode: string,
    exec: string
  } []
  
// totalEntriesProcessed: number;
// unresolvedErrorEntries: number;
// tasksCount: number;
// runningTasksCount: number;
// taskEntriesStatuses:[
//   {
//     taskId: number,
//     unProcessedCount: number,
//     processedCount: number,
//     errorCount: number
//     }
// ]

}

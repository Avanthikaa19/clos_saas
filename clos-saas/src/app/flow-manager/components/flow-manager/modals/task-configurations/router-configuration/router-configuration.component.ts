import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-router-configuration',
  templateUrl: './router-configuration.component.html',
  styleUrls: ['./router-configuration.component.scss']
})
export class RouterConfigurationComponent implements OnInit {
//two way binding to parent component
configValue: Router;
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
      this.flowManagerDataService.getDefaultConfiguration('ROUTER').subscribe(
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
  debug() {
    console.log(this.config);
  }
}
export class Router{
    
        routes: [
            {
                instance: number,
                name: string,
                match: string
            }
        ]
        task: {
            insertBatchSize: number,
            inputPollingMs: number,
            maxThreads: number
        }
    
    
}


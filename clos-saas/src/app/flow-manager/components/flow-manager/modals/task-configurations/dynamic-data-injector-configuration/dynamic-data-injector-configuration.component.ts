import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';

@Component({
  selector: 'app-dynamic-data-injector-configuration',
  templateUrl: './dynamic-data-injector-configuration.component.html',
  styleUrls: ['./dynamic-data-injector-configuration.component.scss']
})
export class DynamicDataInjectorConfigurationComponent implements OnInit {
  searchTable;
  columnDropdown:any;
  tableDropdown:any;
  configValue: FXDataInjectorConfigModel;
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }
  loadingStatuses: boolean = false;
  statuses: string[] = [];
  constructor(
     private flowManagerDataService: FlowManagerDataService,
  ) { }

  ngOnInit(): void {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('DATA_INJECTOR_DYNAMIC').subscribe(
        res => {
          this.config = res;
          console.log(this.config)
        },
        err => {
          console.error(err.error);
        }
      );
    }
    this.refreshFormulasList();
    this.columnVlaueDrop();
    this.tableNameDrop('');
  }
  debug() {
    console.log(this.config);
  }
  
  refreshFormulasList() {
    this.loadingStatuses = true;
    this.flowManagerDataService.getConfigurationFormulas('DATA_INJECTOR_DYNAMIC').subscribe(
      res => {
        this.statuses = res;
        this.loadingStatuses = false;
      },
      err => {
        this.loadingStatuses = false;
      }
    );
  }
  trackByIndex(index: number): number {
    return index;
  }

  // Column/Value Dropdown
  columnVlaueDrop(){
    this.flowManagerDataService.getColumnValue().subscribe(
      res => {
        this.columnDropdown = res;
      },
      );
  }

   // TableName Dropdown
   tableNameDrop(searchTable){
    this.flowManagerDataService.getTableName(searchTable).subscribe(
      res => {
        this.tableDropdown = res;
      },
      );
  }

}
export class FXDataInjectorConfigModel {
  task: {
    maxThreads: number,
    insertBatchSize: number,
    inputPollingMs: number
  };
  dataInjection: {
    enabled: boolean,
    fetchByColumn: string,
    fetchByValue:string;
    injectIntoQueueOf: string,
    updateStatusOnInject: string,
    tableName:string;
  };
}
export class losDataInjectorConfigurationModel {
  tableName:string;
  definedBy: {
    name: string,
    value: string
  };
}

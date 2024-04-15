import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Table, TableField } from '../../../models/models-v2';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { Table, TableField } from 'src/app/flow-manager/models/models-v2';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-table-inserter-configuration',
  templateUrl: './table-inserter-configuration.component.html',
  styleUrls: ['./table-inserter-configuration.component.scss']
})
export class TableInserterConfigurationComponent implements OnInit {
  //two way binding to parent component
  configValue: TableInserterConfigModel;
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  tables: Table[] = [];
  fields: TableField[] = [];
  existFieldMapConfig: any = [];

  selectedTable: Table = {name: "", type: ""};

  constructor(
    private flowManagerDataService: FlowManagerDataService,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('TABLE_INSERTER').subscribe(
        res => {
          this.config = res;
          console.log(this.config);
        },
        err => {
          console.error(err.error);
        }
      );
    } else {
      this.selectedTable.type = this.config.data.tableType;
      this.selectedTable.name = this.config.data.tableName;
    }
    this.refreshTables();
  }

  refreshTables() {
    this.flowManagerDataService.getTableInserterTables().subscribe(
      res => {
        this.tables = res;
        console.log(res);
        //autoselect first
        if(this.tables.length > 0 && (this.config.data.tableType == null || this.config.data.tableType == '')) {
          this.selectedTable = this.tables[0];
        } else 
        //reselect as per existing config
        if(this.tables.length > 0 && this.selectedTable.type != '') {
          for(let i = 0; i < this.tables.length; i++) {
            if(this.tables[i].type == this.selectedTable.type){
              this.selectedTable = this.tables[i];
              break;
            }
          }
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  refreshTableFields() {
    if(this.selectedTable == null || this.selectedTable.name == null || this.selectedTable.type == null) {
      return;
    }
    this.flowManagerDataService.getTableInserterTableFields(this.selectedTable).subscribe(
      res => {
        this.fields = res;
        // get the existing config
        this.existFieldMapConfig = this.config.data.fieldMapping;

        this.config.data.fieldMapping = [];
        for(let i = 0; i < this.fields.length; i++) {
          this.config.data.fieldMapping.push(
            {
              tableField: this.fields[i].name,
              dataType: this.fields[i].dataType,
              entryField: this.fields[i].isAutoincrement == 'YES' ? '' : this.updateEntryFields(this.fields[i].name),
              writeFormat: "",
              autoincrement: this.fields[i].isAutoincrement == 'YES',
              nullable: this.fields[i].isNullable == 'YES'
            }
          );
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  updateEntryFields(tableField: string){
    let resultField = tableField;
     for(let i=0; i< this.existFieldMapConfig.length; i++){
      if(this.existFieldMapConfig[i].tableField == tableField) {
        resultField = this.existFieldMapConfig[i].entryField;
        break;
      }
     }
    return resultField;
  }

  updateSelectedTableDetails() {
    this.config.data.tableType = this.selectedTable.type;
    this.config.data.tableName = this.selectedTable.name;
  }

  clearFields() {
    this.config.data.fieldMapping = [];
  }

  trackByIndex(index: number): number {
    return index;
  }

  debug() {
    console.log(this.config);
  }

}
export class TableInserterConfigModel {
  passThrough: boolean;
  deleteOlderBatchId: boolean;
  task: {
    insertBatchSize: number,
    inputPollingMs: number
  };
  data: {
    tableType: string,
    tableName: string,
    fieldMapping: {
      tableField: string,
      dataType: string,
      entryField: string,
      writeFormat: string,
      autoincrement: boolean,
      nullable: boolean
    }[]
  }
}
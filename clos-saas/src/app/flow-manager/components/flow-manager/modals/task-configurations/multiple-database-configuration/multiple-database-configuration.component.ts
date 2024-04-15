import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
import { EditEtlFormulaComponent } from '../../edit-etl-formula/edit-etl-formula.component';
import { EditFormulaComponent } from '../../edit-formula/edit-formula.component';

@Component({
  selector: 'app-multiple-database-configuration',
  templateUrl: './multiple-database-configuration.component.html',
  styleUrls: ['./multiple-database-configuration.component.scss']
})
export class MultipleDatabaseConfigurationComponent implements OnInit {

 scheduleOption = ['EVERY ONE HOUR', 'EVERY EIGHT HOUR', 'EVERY TWELVE HOUR', 'EVERY DAY']
  //two way binding to parent component
 configValue: ETLConfigModel;
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
   if(toIndex==-1) {
     toIndex=0;
   }
   var element = arr[fromIndex];
   arr.splice(fromIndex, 1);
   arr.splice(toIndex, 0, element);
}


 mqConfigs: string[] = [];
 hideToggle:boolean = false;
 constructor(
   private flowManagerDataService: FlowManagerDataService,
   private dialog:MatDialog
 ) { }

 ngOnInit() {
   if (this.config == undefined || this.config == null) {
     this.flowManagerDataService.getDefaultConfiguration('MULTIPLE_DATABASE').subscribe(
       res => {
         this.config = res;
         console.log(this.config);
       },
    
     err => {
       console.log(err.error);
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
 editFormula(formulaType:string, formulaValue: string,index:any,i:any) {
  const dialogRef = this.dialog.open(EditEtlFormulaComponent, {
    width: '1000px',
    hasBackdrop: false,
    // panelClass: 'no-pad-dialog',
    data: { formulaType:formulaType,formulaValue: formulaValue,index:index,i:i }
  });
 // this.dialogarr.push(dialogRef);
  dialogRef.afterClosed().subscribe(result => {
    console.log('result',result)
    console.log('formulaType',formulaType)

    if (result != null) {
      if(formulaType=='Source Sql')
      this.config.connection.sourceDB[index].sourceTables[i].sourceSql = result;
      else if(formulaType=='Source Recon Sql')
      this.config.connection.sourceDB[index].sourceTables[i].sourceRecon = result;
     // this.updatedIndexes.push(index);
    }
  });
}

}

export class ETLConfigModel {
  task: {
    insertBatchSize: number,
  };
  connection: {
      sourceDB: [{
        driverName: string,
        dbConfig: string,
        dbHost: string,
        dbPort: number,
        dbSchemaName: string,
        dbUserid: string,
        dbPassword: string,
        sourceTables: [{
          sourceRecon: string,
          keyField: string,
          sourceSql: string
        }],
      }];
      destinationDB: {
        driverName: string,
        dbConfig: string,
        dbHost: string,
        dbPort: number,
        dbSchemaName: string,
        dbUserid: number,
        dbPassword: string
      }
  };
  destinationTable: string;
  destinationTableDdl: string;
  enableBatchJob:boolean;
  runnableConsole:string;
  runnableSql:string;
  enableScduler:boolean;
  schedule:string;
  }
  
  
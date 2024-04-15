import {  Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
import { EditEtlFormulaComponent } from '../../edit-etl-formula/edit-etl-formula.component';

@Component({
  selector: 'app-etl-task-configuration',
  templateUrl: './etl-task-configuration.component.html',
  styleUrls: ['./etl-task-configuration.component.scss']
})
export class EtlTaskConfigurationComponent implements OnInit {

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

 constructor(
   private flowManagerDataService: FlowManagerDataService,
   private dialog:MatDialog
 ) { }

 ngOnInit() {
   if (this.config == undefined || this.config == null) {
     this.flowManagerDataService.getDefaultConfiguration('DATA_LOADER_ETL').subscribe(
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
 editFormula(formulaType:string, formulaValue: string) {
  const dialogRef = this.dialog.open(EditEtlFormulaComponent, {
    width: '1000px',
    hasBackdrop: false,
    // panelClass: 'no-pad-dialog',
    data: { formulaType:formulaType,formulaValue: formulaValue }
  });
 // this.dialogarr.push(dialogRef);
  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      if(formulaType=='Source Sql')
      this.config.sourceSql = result;
      else if(formulaType=='Source Recon Sql')
      this.config.reconciliation.sourceReconSql = result;
      else if(formulaType=='Destination Recon Sql')
      this.config.reconciliation.destinationReconSql = result;
      else if(formulaType=='Destination Table Ddl')
      this.config.destinationTableDdl = result;
      else if(formulaType=='Runnable Sql')
      this.config.runnableSql = result;
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
      sourceDB: {
        driverName: string,
        dbConfig: string,
        dbHost: string,
        dbPort: number,
        dbSchemaName: string,
        dbUserid: number,
        dbPassword: string
      };
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
  reconciliation: {
    enableReconciliation: boolean,
    destinationReconSql: string,
    sourceReconSql: string
  };
  sourceSql: string;
  destinationTable: string;
  destinationTableDdl: string;
  enableBatchJob:boolean;
  runnableConsole:string;
  runnableSql:string;
  }
  
  
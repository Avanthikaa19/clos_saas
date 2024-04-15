import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
// import { BucketStatusModalComponent } from 'src/app/flow-manager/modals/bucket-status-modal/bucket-status-modal.component'
import { MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
import { BucketStatusModalComponent } from '../../bucket-status-modal/bucket-status-modal.component';

@Component({
  selector: 'app-aggregator-configuration',
  templateUrl: './aggregator-configuration.component.html',
  styleUrls: ['./aggregator-configuration.component.scss']
})
export class AggregatorConfigurationComponent implements OnInit {
  status: AggregateConfigModel;
  //two way binding to parent component
  configValue: AggregateConfigModel;
  @Output() configChange = new EventEmitter<any>();

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  //this component variables
  //none for now

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('AGGREGATOR').subscribe(
        res => {
          this.config = res;
        },
        err => {
          console.error(err.error);
        }
      );
    }
  }

  openBucketStatus(statusToView: AggregateConfigModel) {

    const dialogRef = this.dialog.open(BucketStatusModalComponent, {
      width: '1300px',
      data: {status: statusToView}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log(result);
      }
    });
  }

  trackByIndex(index: number): number { 
    return index; 
  }

  getAggregateOutputs(): string[] {
    let outputs: string [] = [];
    for(let i = 0; i < this.config.aggregate.length; i++) {
      outputs.push(this.config.aggregate[i].outputName);
    }
    return outputs;
  }

  debug() {
    console.log(this.config);
  }

}
export class AggregateConfigModel {
  time_limit_sec: number;
  retain_first_of_other_fields: boolean;
  task: {
    inputPollingMs: number
  };
  buckets: {
    field: string,
    rule: {
      time_limit_sec: number,
      bucket_limit: number,
      aggregate_output: string,
      field_value: string
    }
  }[];
  group_by: string[];
  aggregate: {
    inputField: string,
    outputName: string,
    operation: string
  }[];
}


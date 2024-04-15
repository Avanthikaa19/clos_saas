import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
import { FieldMapperConfigFragmentModel } from '../field-mapper-fragment/field-mapper-fragment.component';

@Component({
  selector: 'app-hold-release-configuration',
  templateUrl: './hold-release-configuration.component.html',
  styleUrls: ['./hold-release-configuration.component.scss']
})
export class HoldReleaseConfigurationComponent implements OnInit {
  //monaco editor options
  editorOptions = {
    theme: 'vs', 
    language: 'javascript', 
    suggestOnTriggerCharacters: false,
    roundedSelection: true,
	  scrollBeyondLastLine: false,
    autoIndent: "full"
  };

  //ace editor options
  // options: any = { maxLines: 5000, printMargin: false, useWorker: false };

  status: HoldReleaseConfigModel;
  //two way binding to parent component
  configValue: HoldReleaseConfigModel;
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
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('HOLD_RELEASE').subscribe(
        res => {
          this.config = res;
        },
        err => {
          console.error(err.error);
        }
      );
    }
  }

  getFieldMapperConfig(config: any) {
    this.config.fieldMapping = config;
  }

  trackByIndex(index: number): number {
    return index;
  }

  debug() {
    console.log(this.config);
  }

}
export class HoldReleaseConfigModel {
  task: {
    maxThreads: number,
    insertBatchSize: number,
    inputPollingMs: number
  };
  fieldMapping: FieldMapperConfigFragmentModel;
  purpose: string;
  comment: string;
  autoReleaseWhen: string;
  holdTimeLimit: {
    enabled: boolean,
    minutes: number
  };
}

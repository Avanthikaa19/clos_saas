import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlowManagerDataService } from 'src/app/flow-manager/components/flow-manager/services/flow-manager-data.service';
import { EditFormulaComponent } from '../../edit-formula/edit-formula.component';

@Component({
  selector: 'app-hold-release-configurationversion2',
  templateUrl: './hold-release-configurationversion2.component.html',
  styleUrls: ['./hold-release-configurationversion2.component.scss']
})
export class HoldReleaseConfigurationversion2Component implements OnInit {
  configValue: HoldReleaseConfigModel;
  loadingFormulas: boolean = false;
  formulas: string[] = [];
  hideData: boolean = true;

  //monaco editor options
  jsEditorOptions = {
    theme: 'vs',
    language: 'javascript',
    suggestOnTriggerCharacters: false,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    autoIndent: "full"
  };
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
    public dialog: MatDialog,
    private flowManagerDataService: FlowManagerDataService,
  ) { }

  ngOnInit(): void {
    console.log(this.config?.fieldMapping)
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('HOLD_RELEASE2').subscribe(
        res => {
          this.config = res;
        },
        err => {
          console.error(err.error);
        }
      );
    }
    console.log("test", this.config)
    this.refreshFormulasList();
  }
  debug() {
    console.log(this.config);
  }
  editJSFormula(type: "RELEASE_SCRIPT") {
    let scriptToEdit: string = '';
    let title: string = '';
    let formulaType = 'EVALUATE';
    switch (type) {
      case 'RELEASE_SCRIPT': {
        scriptToEdit = this.configValue.releaseScript;
        break;
      }

    }
    const dialogRef = this.dialog.open(EditFormulaComponent, {
      hasBackdrop: false,
      panelClass: 'no-pad-dialog-full-width',
      data: { title: title, formulaType: formulaType, formulaValue: scriptToEdit }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        switch (type) {
          case 'RELEASE_SCRIPT': {
            this.configValue.releaseScript = result;
            break;
          }
        }
      }
    });
  }
  refreshFormulasList() {
    this.loadingFormulas = true;
    this.flowManagerDataService.getConfigurationFormulas('FIELD_MAPPER').subscribe(
      res => {
        this.formulas = res;
        this.formulas.sort();
        this.loadingFormulas = false;
      },
      err => {
        this.loadingFormulas = false;
      }
    );
  }
}
export class HoldReleaseConfigModel {
  task: {
    maxThreads: number,
    insertBatchSize: number,
    inputPollingMs: number
  };
  holdTimeLimit: {
    enabled: boolean,
    minutes: number
  }
  conditionType: "JAVASCRIPT" | "SQL" | "CHECK FREQUENCY";
  releaseScript: string;
  sql: string;
  checkFrequency: boolean;
  checkTimeLimit: number;
  checkFrequencyValue: string;
  sysDateChange: boolean;
  FODateChange: boolean;
  uxRefreshEvent: boolean;
  releaseEntry: boolean;
  entryInstance: number;
  rejectEntry: boolean;
  rejectInstance: number;
  fieldMapping: {
    fieldsAre: string,
    fill: string;
    definedBy: {
      giveAs: string,
      name: string,
      formula: string,
      value: string
    }[];
  }
  expiry: string;
  purpose: string;
  comment: string;
}

import { Component, OnInit, Input, Output, EventEmitter, ɵConsole } from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { JsonEditorComponent } from 'ang-jsoneditor';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
import { FieldMapperConfigFragmentModel } from '../field-mapper-fragment/field-mapper-fragment.component';
@Component({
  selector: 'app-field-mapper-configuration',
  templateUrl: './field-mapper-configuration.component.html',
  styleUrls: ['./field-mapper-configuration.component.scss']
})
export class FieldMapperConfigurationComponent implements OnInit {
  //monaco editor options
  jsEditorOptions = {
    theme: 'vs', 
    language: 'javascript', 
    suggestOnTriggerCharacters: false,
    roundedSelection: true,
	  scrollBeyondLastLine: false,
    autoIndent: "full"
  };
  // options: any = { maxLines: 5000, printMargin: false, useWorker: false };
  //two way binding to parent component
  configValue: FieldMapperConfigModel;
  @Output() configChange = new EventEmitter<any>();
  evaluate: boolean = false;
  content: string = '';
  text: string;

  @Input()
  get config() {
    return this.configValue;
  }
  set config(val) {
    this.configValue = val;
    this.configChange.emit(this.configValue);
  }

  //this component variables
  loadingFormulas: boolean = false;
  formulas: string[] = [];

  constructor(
    private flowManagerDataService: FlowManagerDataService
  ) { }

  ngOnInit() {
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('FIELD_MAPPER').subscribe(
        res => {
          this.config = res;
        },
        err => {
          console.error(err.error);
        }
      );
    }
    this.refreshFormulasList();
  }

  refreshFormulasList() {
    this.loadingFormulas = true;
    this.flowManagerDataService.getConfigurationFormulas('FIELD_MAPPER').subscribe(
      res => {
        this.formulas = res;
        this.loadingFormulas = false;
      },
      err => {
        this.loadingFormulas = false;
      }
    );
  }

  evaluateclick() {
    console.log(this.text);
    this.flowManagerDataService.getEvaluate(this.text).subscribe(
      (res: any) => {
        console.log(res);
        this.content = res;
      },
      (err: any) => {
        console.log(err);
        this.content = err.error;
      }
    );
  }
  
  debug() {
    console.log(this.config);
  }
}

export class FieldMapperConfigModel {
  task: {
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number
  };
  fieldMapping: FieldMapperConfigFragmentModel;
}

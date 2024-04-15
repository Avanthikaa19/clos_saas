import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';

@Component({
  selector: 'app-splitter-configuration',
  templateUrl: './splitter-configuration.component.html',
  styleUrls: ['./splitter-configuration.component.scss']
})
export class SplitterConfigurationComponent implements OnInit, OnChanges {
  //monaco editor options
  jsEditorOptions = {
    theme: 'vs', 
    language: 'javascript', 
    suggestOnTriggerCharacters: false,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    autoIndent: "full"
  };

   //two way binding to parent component
   configValue: SplitterConfigModel;
   parentSelectedIndexValue: number;

   @Output() configChange = new EventEmitter<any>();

   options: any = { maxLines: 5000, printMargin: false, useWorker: false };
   evaluate = false;
   content = '';
   text: string;

   @Input()
   get config() {
     return this.configValue;
   }
   set config(val) {
     this.configValue = val;
     this.configChange.emit(this.configValue);
     this.selectedTabIndex = 0;
   }

   configSelectedIndex = 0;

   @Input()
   get parentSelectedIndex() {
     return this.parentSelectedIndexValue;
   }
   set parentSelectedIndex(val) {
    this.parentSelectedIndexValue = val;
   }

   //this component variables
  loadingFormulas: boolean = false;
  formulas: string[] = [];
  selectedTabIndex = 0;
  showSameOutputRouteWarning = false;
  showSameOutputRouteWarningMessage = '';

  constructor(
    private flowManagerDataService: FlowManagerDataService
  ) { }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.selectedTabIndex = 0;
    if (this.config == undefined || this.config == null) {
      this.flowManagerDataService.getDefaultConfiguration('SPLITTER').subscribe(
        res => {
          this.config = res;
          this.selectedTabIndex = 0;
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
    this.flowManagerDataService.getConfigurationFormulas('SPLITTER').subscribe(
      res => {
        this.formulas = res;
        this.loadingFormulas = false;
      },
      err => {
        this.loadingFormulas = false;
      }
    );
  }
  trackByIndex(index: number): number {
    return index;
  }

  debug() {
    console.log(this.config);
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

  addTemplate() {
    const n = this.config.splitTemplates.length + 1;
    // console.log(this.config.splitTemplates.length)
    // console.log(n)
    this.selectedTabIndex = n;
    this.config.splitTemplates.push({ templateName: 'TEMPLATE' + n, outputRoute: n, fieldMapping: { fieldsAre: 'ALWAYS', fill: 'APPENDED',
                         definedBy: [{name: 'sample_field', giveAs: 'string', formula: 'NONE', value: 'sample_hard_coded_value'}]}});
  }

  getSameOutputRouteWarningMessage(index: number ) {
    const outputRoute = this.config.splitTemplates[index].outputRoute;
    const name = this.config.splitTemplates[index].templateName;
    const duplicate =  this.config.splitTemplates.filter(obj => (obj.outputRoute === outputRoute && obj.templateName !== name));
    if (duplicate.length !== 0 ) {
      this.showSameOutputRouteWarning = true;
      this.showSameOutputRouteWarningMessage = 'Same Output Route has been assigned to ';
      duplicate.forEach(element => {
        this.showSameOutputRouteWarningMessage +=  duplicate.indexOf(element) === 0 ? element.templateName : ', ' + element.templateName;
        });
      return this.showSameOutputRouteWarningMessage;
    } else {
      return null;
    }

  }

  changeValue(event, i) {
    console.log('change value on tab' + i);
    //STRING TO NUMBER CONVERSION
    let number = +event;
    
    this.config.splitTemplates[i].outputRoute = number;
    this.getSameOutputRouteWarningMessage(i);
  }

  //check config ordering
  check(i) {
    this.selectedTabIndex=this.config.splitTemplates.length+1;
    let diff=this.selectedTabIndex-(i+1)
    this.config.splitTemplates.splice(i, diff)
    for(let k=0;k<diff;k++) {
      this.addTemplate()
    }
    this.selectedTabIndex=i
  }

}
export class SplitterConfigModel {
  task: {
    insertBatchSize: number,
    inputPollingMs: number,
    maxThreads: number
  };
  splitTemplates:{
    templateName: string,
    outputRoute: number,
    fieldMapping: {
      fieldsAre: string,
      fill: string,
      definedBy: {
        name: string,
        value: string,
        formula: string,
        giveAs: string,
      }[],
    }
  }[]
}

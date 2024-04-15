import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DiffEditorModel } from 'ngx-monaco-editor';
import { fadeInOut } from 'src/app/app.animations';
import { FlowManagerDataService } from '../../services/flow-manager-data.service';
import { EditFormulaComponent } from '../edit-formula/edit-formula.component';


@Component({
  selector: 'app-edit-etl-formula',
  templateUrl: './edit-etl-formula.component.html',
  styleUrls: ['./edit-etl-formula.component.scss'],
  animations: [fadeInOut]
})
export class EditEtlFormulaComponent implements OnInit {

  selectedTabIndex: number = 0;
  onTabChanged($event) {
    let clickedIndex = $event.index;
    if(clickedIndex == 1) {
      this.modifiedModel = {
        code: this.formulaValue,
        language: this.editorLanguage
      };
    }
  }

  editorLanguage: string = 'text';

  //monaco editor options
  editorOptions;
  diffOptions = {
    theme: 'vs',
    readOnly: true,
	  scrollBeyondLastLine: false
  };
  originalModel: DiffEditorModel;
  modifiedModel: DiffEditorModel;

  formulaType: string;
  originalFormulaValue: string;
  formulaValue: string;

  executingFormula: boolean = false;
  formulaOutput: { isError: boolean, result: any } = null;
  constructor(
    public dialogRef: MatDialogRef<EditFormulaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditFormulaComponent,
    public dialog: MatDialog,
    private notifierService: NotifierService,
    private flowManagerDataService: FlowManagerDataService
  ) {
    if(this.data.formulaType != undefined && this.data.formulaType != null) {
      this.formulaType = data.formulaType;
    }
    if(this.data.formulaValue != undefined && this.data.formulaValue != null) {
      this.originalFormulaValue = data.formulaValue;
      this.formulaValue = data.formulaValue;
    } else {
      this.originalFormulaValue = '';
    }
    switch(this.formulaType) {
      case 'EVALUATE': {
        this.editorLanguage = 'javascript';
        break;
      }
      case 'X_PATH': {
        this.editorLanguage = 'xml';
        break;
      }
      case 'SQL1':
      case 'SQL2':
      case 'SQL3': {
        this.editorLanguage = 'sql';
        break;
      }
      default: {
        this.editorLanguage = 'text';
      }
    }
    this.editorOptions = {
      theme: 'vs', 
      language: this.editorLanguage, 
      suggestOnTriggerCharacters: false,
      roundedSelection: true,
      scrollBeyondLastLine: false,
      autoIndent: "full"
    };
    this.originalModel = {
      code: this.originalFormulaValue,
      language: this.editorLanguage
    };
    this.modifiedModel = {
      code: this.formulaValue,
      language: this.editorLanguage
    };
   }

  ngOnInit(): void {
  }
  onClose(): void {
    this.dialogRef.close();
  }

 // onCodeChange() {
   // this.analyseFormula();
  //}

  formulaParams: {name: string, value: string}[] = [];
  // analyseFormula() {
  //   let oldParams: {name: string, value: string}[] = JSON.parse(JSON.stringify(this.formulaParams));

  //   this.formulaParams = [];
  //   let startIdxArr: number[] = this.getIndicesOf('$[', this.formulaValue, false);
  //   for(let i = 0; i < startIdxArr.length; i++) {
  //     let start: number = startIdxArr[i];
  //     let end: number = (i === startIdxArr.length - 1) ? this.formulaValue.length : startIdxArr[(i+1)];
  //     let paramString: string = this.formulaValue.substring((start + 2), end);
  //     let paramName: string = '';
  //     param_loop:
  //     for(let j = 0; j < paramString.length; j++) {
  //       if(paramString.charAt(j) === ']' || paramString.charAt(j) === ':') {
    
  //         for(let k = 0; k < this.formulaParams.length; k++) {
  //           if(this.formulaParams[k].name === paramName) {
  //             continue param_loop;
  //           }
  //         }
  //         this.formulaParams.push({ name: paramName, value: '' });
  //         break;
  //       } else {
  //         paramName = paramName + paramString.charAt(j);
  //       }
  //     }
  //   }

  //   for(let i = 0; i < this.formulaParams.length; i++) {
  //     for(let j = 0; j < oldParams.length; j++) {
  //       if(this.formulaParams[i].name === oldParams[j].name) {
  //         this.formulaParams[i].value = oldParams[j].value;
  //       }
  //     }
  //   }
  // }

  // testFormula() {
  //   this.executingFormula = true;

  //   let testerConfig: DFMFieldMapperTesterConfig = new DFMFieldMapperTesterConfig();
  //   testerConfig.dataType = 'STRING';
  //   testerConfig.formula = this.formulaType;
  //   testerConfig.length = null;
  //   testerConfig.value = this.formulaValue;
  //   testerConfig.inputs = this.formulaParams;
  //   this.flowManagerDataService.testFieldMapperConfig(testerConfig).subscribe(
  //     res => {
  //       this.formulaOutput = res;
  //       this.executingFormula = false;
  //     }, 
  //     err => {
  //       this.executingFormula = false;
  //       this.showNotification('error', err.error);
  //     }
  //   );
  // }

  apply() {
    this.data.formulaValue = this.formulaValue;
    this.dialogRef.close(this.formulaValue);
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  getIndicesOf(searchStr: string, str: string, caseSensitive: boolean): number[] {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex: number = 0, index: number, indices: number[] = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
  }


}


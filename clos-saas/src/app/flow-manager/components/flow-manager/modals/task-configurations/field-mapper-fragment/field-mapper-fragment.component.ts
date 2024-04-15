import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fadeInOut } from 'src/app/app.animations';
import { FlowManagerDataService } from '../../../services/flow-manager-data.service';
// import { FlowManagerDataService } from 'src/app/flow-manager/services/flow-manager-data.service';
import { EditFormulaComponent } from '../../edit-formula/edit-formula.component';

@Component({
  selector: 'app-field-mapper-fragment',
  templateUrl: './field-mapper-fragment.component.html',
  styleUrls: ['./field-mapper-fragment.component.scss'],
  animations: [fadeInOut]
})
export class FieldMapperFragmentComponent implements OnInit, AfterViewInit {
 @Input() hideInputField : boolean;
  editors: { id: string, editor: any }[] = [];

  //script eval tester popup
  evaluate: boolean = false;
  content: string = '';
  text: string;

  fieldSearch: string = ' ';
  fileName: string = '';

  loading: boolean = true;

  updatedIndexes: number[] = [];
  dialogarr: any[] = [];
  xmlFilesList: string[] = [];
  xmlFieldsData: FieldMapperConfigFragmentModel[] = [];


  //to store config.fieldMapping node as a model
  configValue: FieldMapperConfigFragmentModel;
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
  loadingFormulas: boolean = false;
  formulas: string[] = [];

  constructor(
    private flowManagerDataService: FlowManagerDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getXMLFilesList();
    this.refreshFormulasList();
  }
  ngAfterViewInit(): void {
    //temporary fix to show monaco editors on load
    //TODO
    setTimeout(() => {
      this.fieldSearch = '';
      this.loading = false;
    }, 0);
  }
  ngOnDestroy() {
    this.closeAllOpenTabs();
  }
  closeAllOpenTabs() {
    for (let i = 0; i < this.dialogarr.length; i++) {
      this.dialogarr[i].close();
    }
  }

  //get XMl files list
  getXMLFilesList() {
    this.flowManagerDataService.getxmlFiles().subscribe(
      res => {
        this.xmlFilesList = res;
      }
    );
  }
  //get XML file fields data
  getXMLFileFieldsData() {
      this.flowManagerDataService.getXmlFileFieldsData(this.fileName).subscribe(
      res => {
        res.forEach(e => {
          let giveAs = e.dataType + (e.length && e.dataType.trim().toLowerCase() == 'string' ? '|' + e.length : '');
          if (!e.length) {
            giveAs = giveAs.toLowerCase();
           }
           this.config.definedBy.push({
            giveAs:giveAs,
            name: e.name,
            formula:e.formula,
            value: e.value
          }
        )
        });
      }
    );

  }


  initEditor(id, editor) {
    for (let edt of this.editors) {
      if (edt.id === id) {
        edt.editor = editor;
        console.log('updated editor' + id);
        return;
      }
    }
    this.editors.push({ id, editor });
    console.log('pushed editor' + id);
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

  testEvaluateOnClickTest() {
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

  expandToggled(id: string) {
    for (let edt of this.editors) {
      if (edt.id === id) {
        console.log(edt.editor.getValue());
        // edt.editor.layout();
        // edt.editor.layout({} as monaco.editor.IDimension);
        return;
      }
    }
    // let editor = window.monaco.editor.create(document.getElementById(id));
    // editor.layout();
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        // this.layout.specification.headerBands[0].elementsLeft, 
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  editFormula(index: number, formulaType: string, formulaValue: string) {
    const dialogRef = this.dialog.open(EditFormulaComponent, {
      width: '1000px',
      hasBackdrop: false,
      // panelClass: 'no-pad-dialog',
      data: { formulaType: formulaType, formulaValue: formulaValue }
    });
    this.dialogarr.push(dialogRef);
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.config.definedBy[index].value = result;
        this.updatedIndexes.push(index);
      }
    });
  }

}

export class FieldMapperConfigFragmentModel {
  fill: string;
  fieldsAre: string;
  definedBy: {
    giveAs: string,
    name: string,
    formula: string,
    value: string
  }[];
}

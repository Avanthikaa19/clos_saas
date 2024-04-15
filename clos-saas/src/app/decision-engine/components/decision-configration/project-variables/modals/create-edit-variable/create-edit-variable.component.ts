import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierService } from 'angular-notifier';
import { DecisionTableParameters } from '../../../../../models/DecisionTable';
import { Others, Variables } from '../../../../../models/Variables';
import { UrlService } from '../../../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../../../services/decision-engine-id.service';
import { VariablesService } from '../../../../../services/variables.service';
import { AddHeaderComponent } from '../add-header/add-header.component';
import { AddParamComponent } from '../add-param/add-param.component';
import { ConfigVariableComponent, ResultConfig } from '../config-variable/config-variable.component';
import { PythonEditorComponent } from '../python-editor/python-editor.component';

@Component({
  selector: 'app-create-edit-variable',
  templateUrl: './create-edit-variable.component.html',
  styleUrls: ['./create-edit-variable.component.scss']
})
export class CreateEditVariableComponent implements OnInit {
  varParams: DecisionTableParameters[] = [
    {
      "parameterName": "",
      "parameterType": {
        name: "",
        type: "",
      },
    },
  ];
  variableFields: Variables;
  headersData: any[] = [];
  header: any[] = [];
  constructor(
    public dialog: MatDialog,
    private url: UrlService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateEditVariableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateEditVariableComponent,
    private variableService: VariablesService,
    private selectedProject: DecisionEngineIdService,
    private notifierService: NotifierService
  ) {
    this.variableFields = JSON.parse(JSON.stringify(data.variableFields));
    console.log(this.variableFields)
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }
  async ngOnInit() {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
  }

  openPythonEditor(pythonCode: Others) {
    console.log('On Open Editor', pythonCode);
    const dialogRef = this.dialog.open(PythonEditorComponent, {
      height: "80vh",
      width: "70vw",
      data: { variableFields: pythonCode },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.variableFields.others = result;
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  
  openConfigVariable(config:ResultConfig[]){
    console.log(config)
    const dialogRef = this.dialog.open(ConfigVariableComponent,{
      height: "80vh",
      width: "60vw",
      data: { variableFields: config },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      let toString = result;
      let toJson = JSON.parse(result);
      console.log(toJson);
      this.variableFields.config = toJson;
    });
  }

  saveVariables() {
    console.log(this.variableFields);
    this.variableFields.projectdetail = this.selectedProject.selectedProjectId;
    console.log(  this.variableFields)
    if (!this.variableFields.id) {
      this.variableService.createVariables(this.variableFields).subscribe(
        res => {
          this.showNotification('success', 'Created Successfully.')
          this.onNoClick();
        },
        (err) => {
          this.showNotification('error', 'Oops! Something went wrong.')
        }
      )
    } else {
      this.variableService.updateVariables(this.variableFields.id, this.variableFields).subscribe(
        res => {
          this.showNotification('success', 'Updated Successfully.')
          this.onNoClick();
        },
        (err) => {
          this.showNotification('error', 'Oops! Something went wrong.')
        }
      )
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  addParam() {
    const dialogRef = this.dialog.open(AddParamComponent, {
      width: '65rem',
      height: '75rem',
      data: this.varParams
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let varParms = JSON.parse(result);
        console.log(varParms)
        varParms.forEach((p: any) => {
          console.log(p)
          this.variableFields.parameters = varParms;
          this.varParams = varParms;
          console.log(this.variableFields.parameters)
        })

      }
    });
  }

  addHeader() {
    const dialogRef = this.dialog.open(AddHeaderComponent, {
      width: '70rem',
      height: '80rem',
      data: this.varParams

    });

    dialogRef.afterClosed().subscribe(result => {
      this.headersData.push(result);
      let data: any = result.data.nodeName.toUpperCase() + "  -  " + result.data.nodeType.toUpperCase()
      console.log(data);
      this.header.push(data);
      console.log(this.headersData);
      this.variableFields.headers = this.headersData
      console.log(this.variableFields.headers)
    });
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Datatype } from '../../../../../models/ObjectModel';
import { UrlService } from '../../../../../services/http/url.service';
import { ObjectModelService } from '../../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-config-variable',
  templateUrl: './config-variable.component.html',
  styleUrls: ['./config-variable.component.scss']
})
export class ConfigVariableComponent implements OnInit {
  variableFields: any;
  configure:ConfigMethod[];
  configData: Config[] = [
    {
      "name": "",
      "configMethod": [
        {
          "name": "groupBy",
          "input": "",
          "output": []
        },
        {
          "name": "columnFilter",
          "input": "",
          "output": []
        },
        {
          "name": "rowFilter",
          "input": "",
          "output": []
        },
       
        {
          "name": "calc",
          "input": "",
          "output": []
        },
      ]
    },
  ]


  params: Datatype[] = [];
  projectId: number = null as any;
  columnValues: any[] = [];
  filteredColumns: any[] = [];
  calcArray: string[] = ["aggregate", "transform"];
  filterSymbols: string[] = ["=", "!=", ">", "<", ">=", "<="];
  calcValues: string[] = ["min", "max", "sum","count"];
  name: string = '';

  yday: number = 0;

  constructor(
    private objectModelService: ObjectModelService,
    private notifierService: NotifierService,
    private selectedProject: DecisionEngineIdService,
    private url: UrlService,
    public dialogRef: MatDialogRef<ConfigVariableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfigVariableComponent,
  ) {
    console.log(data.variableFields)
    if(data.variableFields){
      if(data.variableFields.length>1){
        this.configData.pop()
        for(let i=0;i<data.variableFields.length;i++){
          this.configData.push({name: data.variableFields[i]['varName'],configMethod:[{name: 'groupBy',input: '', output: data.variableFields[i]['groupBy']},
          {name: 'columnFilter',input: '',output: data.variableFields[i]['columnFilter']},
          {name: 'rowFilter',input: '',output: data.variableFields[i]['rowFilter']},
          {name: 'calc',input: '',output: data.variableFields[i]['calc']}]})
        }
  
      }else{
        console.log('No data passed')
        // this.pythonCode =  new Others();
      }
    }
  
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
    console.log('Selected Project', this.selectedProject.selectedProjectId);
    this.projectId = this.selectedProject.selectedProjectId;
    this.getDefaultObject();
  }
  getConfigData(){

  }
  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        let children = res[0].schema.children;
        this.params = children;
        console.log(this.params);
        this.name = this.params[0].name;
      },
      (err) => {
        this.showNotification('error', 'Oops! Something Went Wrong.');
      }
    )
  }

  onValueSelected(data: any) {
    this.columnValues = data.children;
    this.filterColumns("");
  }

  filterColumns(event: any) {
    let searchText: string = event;
    if (searchText == null) {
      searchText = '';
    }
    this.filteredColumns = [];
    for (let i = 0; i < this.columnValues.length; i++) {
      if (this.columnValues[i].name != null) {
        if (this.columnValues[i].name.toUpperCase().includes(searchText.trim().toUpperCase())) {
          this.filteredColumns.push(this.columnValues[i]);
        }
      }
    }
  }

  onSaveClick() {
    let resultDataStr: ResultConfig[] = [];
    this.configData.forEach(e => {
      let calc = e.configMethod[3].input + "('"+ e.configMethod[3].calcValue  + "')";
      resultDataStr.push({
        "varName": e.name,
        "groupBy": e.configMethod[0].output,
        "columnFilter": e.configMethod[1].output,
        "rowFilter": e.configMethod[2].output,
        "calc": calc,
      })
    })
    console.log(resultDataStr);
    let toString = JSON.stringify(resultDataStr);
    this.dialogRef.close(toString);
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  getDifferenceInDays(date1: any, date2: any) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }

  getPushData(input: any, symbol: any, value: any, calc: any) {
    if (input && symbol && value) {
      console.log(input + ' ' + symbol + ' ' + value)
      return input + ' ' + symbol + ' ' + value;
    }
    else if (input && calc) {
      console.log(input + "(" + calc + ")");
      return input + "(" + calc + ")";
    }
    else {
      console.log(input)
      return input;
    }
  }

}

export class Config {
  name: string;
  configMethod: ConfigMethod[];
}

export class ConfigMethod {
  name: string;
  input: string;
  output: string[];

  //UI use
  groupCol?: string;
  filterSymbol?: string;
  filterValue?: string;
  calcValue?: string;
}

export class ResultConfig {
  id?: number;
  varName: string;
  groupBy: string[];
  columnFilter: string[];
  rowFilter: string[];
  calc: string;
}
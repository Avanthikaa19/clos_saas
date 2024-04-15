import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DecisionTableParameters } from '../../../../models/DecisionTable';
import { DecisionTablesList } from '../../../../models/DecisionTables';
import { Datatype } from '../../../../models/ObjectModel';
import { DecisionTablesService } from '../../../../services/decision-tables.service';
import { UrlService } from '../../../../services/http/url.service';
import { DecisionEngineIdService } from '../../../../services/decision-engine-id.service';
import { ObjectModelService } from '../../../../services/Object-model.service'

@Component({
  selector: 'app-create-decision-tables',
  templateUrl: './create-decision-tables.component.html',
  styleUrls: ['./create-decision-tables.component.scss']
})
export class CreateDecisionTablesComponent implements OnInit {

  projectId: number = null as any;
  datatypes: string[] = ['string', 'integer', 'boolean'];
  params: Datatype[] = [];
  tableDetails: DecisionTablesList = new DecisionTablesList();
  tableParams: DecisionTableParameters[] = [
    {
      "parameterName": "",
      "parameterType": {
        name: "",
        type: "",
      },
    },
  ];
  selectedParam: Datatype[] = [];

  constructor(
    private url: UrlService,
    private decisionTableService: DecisionTablesService,
    private selectedProject: DecisionEngineIdService,
    private objectModelService: ObjectModelService,
    public dialogRef: MatDialogRef<CreateDecisionTablesComponent>,
    private notifierService: NotifierService
  ) { }

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

  addParameter() {
    this.tableParams.push({
      "parameterName": "",
      "parameterType": {
        name: "",
        type: "",
      },
    })
  }
  //Function for selecting objectmodel parameter
  selectParameterFromObject(e: any, data: any) {
    if (e.checked) {
      this.selectedParam.push(data)
      console.log(this.selectedParam)
    }
    else if (!e.checked) {
      DecisionTableParameters
      let i = this.selectedParam.indexOf(data)
      this.selectedParam.splice(i, 1)
      console.log(this.selectedParam)
    }
  }
  createTableList() {
    console.log(this.tableParams)
    // this.tableDetails.parameters = JSON.stringify(this.tableParams)
    console.log(this.tableDetails);
    this.decisionTableService.createDecisionTable(this.tableDetails).subscribe(
      res => {
        this.showNotification('success', 'Created Successfully.')
        this.onNoClick();
      },
      (err) => {
        this.showNotification('error', 'Oops! Something Went Wrong.')
      }
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res => {
        let children = res[0].schema.children;
        this.params = children;
      },
      (err) => {
        this.showNotification('error', 'Oops! Something Went Wrong.')
      }
    )
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  errMsg(): any{
    if(!this.tableDetails.name){
      return '*Name is a required field';
    }
    else if(this.tableDetails.description){
      return ''
    }
    return '';
  }

}


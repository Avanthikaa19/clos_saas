import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecisionTableParameters } from '../../../../../models/DecisionTable';
import { Datatype } from '../../../../../models/ObjectModel';
import { UrlService } from '../../../../../services/http/url.service';
import { ObjectModelService } from '../../../../../services/Object-model.service';
import { DecisionEngineIdService } from '../../../../../services/decision-engine-id.service';

@Component({
  selector: 'app-add-param',
  templateUrl: './add-param.component.html',
  styleUrls: ['./add-param.component.scss']
})
export class AddParamComponent implements OnInit {

  varParams: DecisionTableParameters[] = [
    {
      "parameterName": "",
      "parameterType": {
        name: "",
        type: "",
      },
    },
  ];

  params: Datatype[] = [];

  constructor(
    private objectModelService: ObjectModelService,
    private selectedProject: DecisionEngineIdService,
    private url: UrlService,
    public dialogRef: MatDialogRef<AddParamComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DecisionTableParameters[]

  ) { }


  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    this.varParams=this.data
    console.log(this.varParams)
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
  
    this.getDefaultObject();
  }

  addParamFields() {
    this.varParams.push({
      "parameterName": "",
      "parameterType": {
        name: "",
        type: "",
      },
    })
    console.log("param",this.varParams)
  }

  getDefaultObject() {
    this.objectModelService.getDefaultObjectModel().subscribe(
      res=> {
        console.log(res);
        let children = res[0].schema.children;
        this.params = children;
        console.log('Children', this.params);
      }
    )
  }

  onCreateClick(){
    console.log(this.varParams);
    let varParamString = JSON.stringify(this.varParams);
    this.onNoClick(varParamString);
  }

  onNoClick(params: string): void {
    this.dialogRef.close(params);
  }

}

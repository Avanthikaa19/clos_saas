import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DecisionEngineIdService {

  selectedProjectId:number=+sessionStorage.getItem("ProjectId")
  selectedServiceId: any;
  selectedRuleSetId: any;
  selectedVariableLibId:any

  constructor() { }

  getProjetId(){
    

  }
}

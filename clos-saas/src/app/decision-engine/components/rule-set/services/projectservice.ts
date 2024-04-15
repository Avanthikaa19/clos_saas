import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class ProjectService {
    selectedProjectId:number=+sessionStorage.getItem("ProjectId")
    selectedServiceId: any;
    selectedRuleSetId: any;
    selectedVariableLibId:any
  }
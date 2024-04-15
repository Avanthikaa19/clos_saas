import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class ProjectIdService {

    selectedProjectId:number=+sessionStorage.getItem("ProjectId");
    
  }

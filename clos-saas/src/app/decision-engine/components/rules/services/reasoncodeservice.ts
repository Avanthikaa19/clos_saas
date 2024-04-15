import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { ReasonCode } from "../../rule-set/models/rulesetmodels";

@Injectable({
    providedIn: 'root'
  })
  export class ReasoncodeService {

    API_URL: string = '';
    constructor(
      private http: HttpClient,
      public configurationService: ConfigurationService,
    ) { 
      this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
    }
  
    getReasonCodeList(id:number) {
      return this.http.get<ReasonCode[]>(`${this.API_URL}reasoncodelist/`)
    }
    
  }
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { Functions } from "../models/rulesetmodels";

@Injectable({
    providedIn: 'root'
  })
  export class FunctionService {

    API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getFunctionsList(id:number) {
    return this.http.get<Functions>(`${this.API_URL}functions/`)
  }
}
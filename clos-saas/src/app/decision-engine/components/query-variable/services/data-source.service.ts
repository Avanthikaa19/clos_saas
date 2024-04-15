import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";

@Injectable({
    providedIn: 'root'
  })
  export class DataSourceService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

    getMysqlList(){
        return this.http.get<any>(`${this.API_URL}dataSourceMysql/`);
      }

  }
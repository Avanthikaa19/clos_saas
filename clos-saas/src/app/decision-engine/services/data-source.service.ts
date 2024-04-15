import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from './http/url.service';
import { ConfigurationService } from '../../services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  API_URL: string = '';
  saveUpdate: boolean = false;
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getMysqlFieldList(db_type: string){
    return this.http.get<any>(`${this.API_URL}dataSourceMysqlFields/${db_type}/`);
  }

  createMysqlConfig(db_config: any){
    return this.http.post<any>(`${this.API_URL}createDataSourceMysql/`,db_config);
  }

  updateMysqlConfig(config_id: number,db_config: any){
    return this.http.put<any>(`${this.API_URL}dataSourceMysqlDetail/${config_id}/`, db_config);
  }

  getMysqlList(){
    return this.http.get<any>(`${this.API_URL}dataSourceMysql/`);
  }

  getMysqlConfigById( configId: number){
    return this.http.get<any>(`${this.API_URL}dataSourceMysql/?configId=${configId}`);
  }

  deleteConfig(configId: number){
    return this.http.delete(`${this.API_URL}dataSourceDeleteConfig/${configId}/`)
  }

  dbConnection(config_id: number,db_config: any){
    return this.http.put<any>(`${this.API_URL}Databaseconfig/${config_id}/`, db_config);
  }
}

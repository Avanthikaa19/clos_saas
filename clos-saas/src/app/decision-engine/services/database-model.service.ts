import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DatabaseConfig } from '../models/DatabaseConfig';

@Injectable({
  providedIn: 'root'
})
export class DatabaseModelService {

  API_URL: string = '';

  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getDatabaseName(){
    return this.http.get<any>(`${this.API_URL}db_name/`);
  }

  getTableName(db_config: DatabaseConfig){
    return this.http.post<any>(`${this.API_URL}db_name/`,db_config);
  }

  getFieldName(page: number,pageSize: number,db_config: DatabaseConfig){
    return this.http.put<any>(`${this.API_URL}db_name/?page=${page}&page_size=${pageSize}`,db_config);
  }
  databaseSearchTable(search:string,tableName:string){
    return this.http.get(`${this.API_URL}searchdbName/?search=${search}&tableName=${tableName}`);
  }
}

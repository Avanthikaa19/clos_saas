import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { TableList } from '../models/DecisionTableList';

@Injectable({
  providedIn: 'root'
})
export class TabletestService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  gettablelist(id:number){
    return this.http.get<TableList[]>(`${this.API_URL}decisiontable/`);
    
  }
  getonetable(id:number){
    return this.http.get<TableList[]>(`${this.API_URL}project/decisiontable/${id}/`);
    } 
  tableExecution(data:any){
     return this.http.post<any>(`${this.API_URL}decisiontableexecution/`,data,{ reportProgress: true,
      observe:'response'});
  }
}

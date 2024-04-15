import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class VariablelistService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getvariableslist(){
    return this.http.get<any[]>(`${this.API_URL}variableslist/`);
    
  }
  getonevariable(id:number){
    return this.http.get<any>(`${this.API_URL}variablesdetail/${id}/`);
    } 
  variableExecution(data:any,id:number){
     return this.http.post<any>(`${this.API_URL}executescript/?var_id=${id}`,data,{ reportProgress: true,
      observe:'response'});
  }
}

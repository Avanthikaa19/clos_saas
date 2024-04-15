import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { VariableLibrary } from '../models/Variables';

@Injectable({
  providedIn: 'root'
})
export class VariablelibTestService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }
  getVariableLibraryList(pid: number) {
    return this.http.get<VariableLibrary[]>(`${this.API_URL}variableliblists/`);
  }

  getOneVariableLibraryById(varLibId: number){
    return this.http.get<VariableLibrary>(`${this.API_URL}variablelibrarydetail/${varLibId}/`);
  }

  execcuteLibrary(data:any){
    return this.http.post<any>(`${this.API_URL}variableLibraryExecution/`,data);


  }
}

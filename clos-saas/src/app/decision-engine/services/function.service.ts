import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Functions } from '../models/Function';

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
getFunctionbyId(id:number) {
  return this.http.get<Functions>(`${this.API_URL}function/${id}/`)
}
updateFunctions(id:number,data:Functions){
  return this.http.put<Functions>(`${this.API_URL}function/${id}/`, data)

}
createFunction(functionData: Functions){
  return this.http.post<Functions>(`${this.API_URL}function/`, functionData)
}
deleteFunction(id:number) {
  return this.http.delete<Functions>(`${this.API_URL}function/${id}/`)
}

}

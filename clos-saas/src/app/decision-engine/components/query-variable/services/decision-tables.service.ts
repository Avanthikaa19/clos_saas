import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { StandardsTable } from '../models/query';

@Injectable({
  providedIn: 'root'
})
export class DecisionTablesService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  // getstandardstable(){
  //   return this.http.get<StandardsTable[]>(`${this.API_URL}getstandardstable/`)
  // }
  
}
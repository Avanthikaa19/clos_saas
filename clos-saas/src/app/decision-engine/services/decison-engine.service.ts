import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Decision} from '../models/DesicionEngine';

@Injectable({
  providedIn: 'root'
})
export class DecisonEngineService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getprojectlist() {
    return this.http.get(`${this.API_URL}projectlist/`)
  } 
  getprojectdetail(id: number) {
    return this.http.get(`${this.API_URL}projectdetails/${id}/`)
  }
  createprojectlist(data:Decision) {
    return this.http.post(`${this.API_URL}createproject/`,data)
  }  
}

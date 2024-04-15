import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { UrlService } from '../services/http/url.service';

@Injectable({
  providedIn: 'root'
})
export class VersionServiceService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

    saveDecisionFlow(id: number,data:any) {
      return this.http.put(`${this.API_URL}flowversionupdate/${id}/`,data)
    }
    getVersionHistory(id:number,data:any) {
      return this.http.post(`${this.API_URL}versionlist/${id}/`,data)
    }
}

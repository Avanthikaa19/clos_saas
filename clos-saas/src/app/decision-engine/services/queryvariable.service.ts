import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { QueryVariable } from '../models/QueryVariable';

@Injectable({
  providedIn: 'root'
})
export class QueryvariableService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  // DECISION FLOW -> ASSIGN NODE -> TYPE FIELD CHANGE GET API
  getQueryList(id: number) {
    return this.http.get<QueryVariable[]>(`${this.API_URL}getQuerybuilderlist/${id}/`);
  }

  createQueryVariable(query: QueryVariable) {
    return this.http.post<QueryVariable>(`${this.API_URL}querybuilderlist/`, query);
  }
  editQuery(id: number, query: QueryVariable) {
    return this.http.put<QueryVariable>(`${this.API_URL}querybuilderdetail/${id}/`, query);
  }
  getOneQuery(id: number) {
    return this.http.get<QueryVariable>(`${this.API_URL}querybuilderdetail/${id}/`);
  }
  deleteQuery(id: number) {
    return this.http.delete(`${this.API_URL}querybuilderdetail/${id}/`);
  }

}

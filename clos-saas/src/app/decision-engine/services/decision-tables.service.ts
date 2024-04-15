import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DecisionTablesList } from '../models/DecisionTables';
import { StandardsTable } from '../models/Standards';
import { UrlService } from './http/url.service';

@Injectable({
  providedIn: 'root'
})
export class DecisionTablesService {

  API_URL: string = '';
  saveUpdate: boolean = false;
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }
  getListOfTable(pageNum: number, pageSize: number) {
    return this.http.get<DecisionTablesList[]>(`${this.API_URL}createtable/?page=${pageNum}&page_size=${pageSize}`);
  }

  // DECISION FLOW -> ASSIGN NODE -> TYPE FIELD CHANGE GET API
  getTableList() {
    return this.http.get<DecisionTablesList[]>(`${this.API_URL}getDecisionTable/`)
  }
  createDecisionTable(decisionTable: DecisionTablesList) {
    return this.http.post<DecisionTablesList>(`${this.API_URL}createtable/`, decisionTable);
  }
  updateDecisionTableById(id: number, decisionTable: DecisionTablesList) {
    return this.http.put<DecisionTablesList>(`${this.API_URL}updatetable/${id}/`, decisionTable);
  }
  getDecisionTableById(id: number) {
    return this.http.get<DecisionTablesList>(`${this.API_URL}gettable/${id}/`);
  }
  getObjectSchemaById(id: number) {
    return this.http.get<any>(`${this.API_URL}objectsSchemadetail/${id}/`);
  }
  getstandardstable() {
    return this.http.get<StandardsTable[]>(`${this.API_URL}getstandardstable/`);
  }

  deleteDecisionTableById(id: number) {
    return this.http.delete<DecisionTablesList>(`${this.API_URL}updatetable/${id}/`);
  }

    //to search decision table standards

    getSearchDecisionStandard(searchName:string){
      return this.http.get(`${this.API_URL}searchdecisiontable/?search=${searchName}`)
    }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { QueryVariable } from "../models/query";

@Injectable({
  providedIn: 'root'
})
export class QueryvariableService {

  API_URL: string = '';
  saveUpdate: boolean = false;
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }
  getQueryList(id: number, pageNum: number, pageSize: number) {
    return this.http.get<QueryVariable[]>(`${this.API_URL}querybuilderlist/${id}/?page=${pageNum}&page_size=${pageSize}`);
  }

  deleteQuery(id: number) {
    return this.http.delete(`${this.API_URL}querybuilderdetail/${id}/`);
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

  // To listing a database names
  getDataBaseName() {
    return this.http.get(`${this.API_URL}QueryVariabledblist/`);
  }

  // To list table names
  getTableName(db_name: string) {
    return this.http.post(`${this.API_URL}QueryVariabletablelist/?db_name=${db_name}`, '');
  }

  // To list field names
  getFieldName(tablename: string, db_name: string) {
    return this.http.post(`${this.API_URL}QueryVariablefieldlist/?tablename=${tablename}&db_name=${db_name}`, '');
  }

  //to search Query
  getSearchQuery(searchName:string){
    return this.http.get(`${this.API_URL}searchqueryvariable/?search=${searchName}`)
  }
}
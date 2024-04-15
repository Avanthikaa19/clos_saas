import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { configDetails, configurations } from 'src/app/loan-application/components/models/config.models';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ClosCaseManagerService {

  API_URL: string = '';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.clos_data_service;
  }

  private dataSubject = new BehaviorSubject<any>(null);

  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }
  
  // INTERNAL SCORING LISTING API (USING COLUMN DEFINITIOS)
  getList(columns: ColumnDefinition[], page: number, pageSize: number, status: string, isView: boolean, tab: string,loanType:string) {
    return this.http.post(`${this.API_URL}/case-manager/duplicate/applications?page=${page}&pageSize=${pageSize}&status=${status}&isView=${isView}&tab=${tab}&loanType=${loanType}`, columns);
  }
  // FIELDS NAME API 
  getFieldsName() {
    return this.http.get<any[]>(`${this.API_URL}/case-manager/field`)
  }

  // To get all rule configuration
  getAllRules(page: number, pageSize: number) {
    return this.http.get(`${this.API_URL}/rule/getAll?pageNum=${page}&pageSize=${pageSize}`);
  }

  // To delete a rule configuration
  deleteRules(id: number) {
    return this.http.delete(`${this.API_URL}/rule/deleteRule?ruleId=${id}`, { responseType: 'text' });
  }

  //To get all field names of a Internal Application table
  getAppField(keyword: string, page: number, pageSize: number) {
    return this.http.get(`${this.API_URL}/datasource/retrieveInternalDBFieldNames?keyword=${keyword}&page=${page}&pageSize=${pageSize}`)
  }

  // Algorithm Dropdown
  algDrpdwn() {
    return this.http.get(`${this.API_URL}/rule/algorithm/dropdown`);
  }

  // Stage Dropdown
  stage() {
    return this.http.get(`${this.API_URL}/rule/stage/dropdown`);
  }

  // To get all table names of a particular database
  getTable(keyword: string, page: number, pageSize: number, config: configurations) {
    return this.http.post(`${this.API_URL}/datasource/retrieveTableNames?keyword=${keyword}&page=${page}&pageSize=${pageSize}`, config);
  }

  // To create a new Rule
  createRules(ruleName: string, ruleDescription: string, stage: string, config: configDetails[]) {
    return this.http.post(`${this.API_URL}/rule/create?ruleName=${ruleName}&ruleDescription=${ruleDescription}&executionStage=${stage}`, config)
  }

  // To get all field names of a particular table
  getFields(tableName: string, keyword: string, page: number, pageSize: number, config: configurations) {
    return this.http.post<any>(`${this.API_URL}/datasource/retrieveFieldNames?tableName=${tableName}&keyword=${keyword}&page=${page}&pageSize=${pageSize}`, config);
  }

  // Case Manager Filter
  getDropdownList(pageNumber: number, pageSize: number, columnName: string, search: string) {
    return this.http.get(`${this.API_URL}/applicant-details/get/dropdown-values?pageNumber=${pageNumber}&pageSize=${pageSize}&columnName=${columnName}&search=${search}`);
  }
  //Case Manager Export
  appVerificationExport(columns: ColumnDefinition[],format:string,status:string,stageName:string,loanType:string) {
    return this.http.post<any>(`${this.API_URL}/case-manager/export/?format=${format}&status=${status}&tab=${stageName}&loanType=${loanType}`, columns);
  }
}

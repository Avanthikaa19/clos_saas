import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigurationService } from "src/app/services/configuration.service";
import { configDetails, configurations } from "../models/config.models";

@Injectable({
    providedIn: 'root'
  })
  export class ConfigService {

    API_URL: string = '';
    ActivaRule:boolean= false;

    constructor(
      private http: HttpClient,
      private configurationService: ConfigurationService,
    ){
      this.API_URL = this.configurationService.apiUrl().services.clos_data_service; 
    }

    // To create a new Rule
    createRules(ruleName: string,ruleDescription: string,stage:string,config: configDetails[]) {
      return this.http.post(`${this.API_URL}/rule/create?ruleName=${ruleName}&ruleDescription=${ruleDescription}&executionStage=${stage}`,config)
    }

    // To get existing rule configuration
    ViewRules(id: string) {
      return this.http.get<configDetails>(`${this.API_URL}/rule/getById?id=${id}`)
    }

    // To update existing rule
    updateRules(ruleName: string,ruleDescription: string,id: string,stage,config: configDetails[]) {
      return this.http.put(`${this.API_URL}/rule/update?ruleName=${ruleName}&ruleDescription=${ruleDescription}&id=${id}&executionStage=${stage}`,config,{responseType:'text'})
    }

    // Matching Configuration

    // To get all table names of a particular database
    getTable(keyword: string,page: number,pageSize: number,config: configurations) {
      return this.http.post(`${this.API_URL}/datasource/retrieveTableNames?keyword=${keyword}&page=${page}&pageSize=${pageSize}`,config);
    }

    // To get all field names of a particular table
    getFields(tableName: string,keyword: string,page: number,pageSize: number,config: configurations) {
      return this.http.post<any>(`${this.API_URL}/datasource/retrieveFieldNames?tableName=${tableName}&keyword=${keyword}&page=${page}&pageSize=${pageSize}`,config);
    }

     //To get all field names of a Internal Application table
     getAppField(keyword: string,page: number,pageSize: number) {
      return this.http.get(`${this.API_URL}/datasource/retrieveInternalDBFieldNames?keyword=${keyword}&page=${page}&pageSize=${pageSize}`)
    }

    // Duplicate Preview
    duplicatePreview(id: number) {
      return this.http.get(`${this.API_URL}/get/application/detail/${id}`);
    }

    // Stage Dropdown
    stage() {
      return this.http.get(`${this.API_URL}/rule/stage/dropdown`);
    }
    //Export Rules
    exportRuels(ruleId:any[]){
      return this.http.post(`${this.API_URL}/rule/dataEntry/export`,ruleId)
    }

    // Algorithm Dropdown
    algDrpdwn(){
      return this.http.get(`${this.API_URL}/rule/algorithm/dropdown`);
    }

    //Import Rules
    importRules(file: File): Observable<HttpEvent<{}>> {
      const formdata: FormData = new FormData();
      formdata.append('file', file);
      const req = new HttpRequest('POST', `${this.API_URL}/rule/dataEntry/import`, formdata, {
        reportProgress: true,
        responseType: 'text'
      }
      );
      return this.http.request(req);
    } 
  }
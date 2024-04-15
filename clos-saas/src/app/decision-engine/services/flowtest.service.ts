import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DecisionFlow } from '../models/DecisionFlow';

@Injectable({
  providedIn: 'root'
})
export class FlowtestService {
  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }
  //GET DECISION FLOW LIST
  decisionFlowList(id: number) {
    return this.http.get<DecisionFlow[]>(`${this.API_URL}decision_Flow/`)
  }
  getoneflow(id: number) {
    // return this.http.get<DecisionFlow>(`${this.API_URL}decisionflowdetail/${id}/`);
    return this.http.get<DecisionFlow>(`${this.API_URL}flowtestconfig/${id}/`);
  }
  getDefaultDecisionFlow(id: number){
    return this.http.get<any>(`${this.API_URL}decisionflowdetail/${id}/`)
  }

  flowexecution(data: any) {
    return this.http.post<any>(`${this.API_URL}flowexecution/`, data, {
      reportProgress: true,
      observe: 'response'
    });
  }
  decisionExecution(data: any) {
    return this.http.post<any>(`${this.API_URL}decisionengine/`, data, {
      reportProgress: true,
      observe: 'response'
    });
  }
  saveConfig(fid: number,config: any){
    return this.http.put<any>(`${this.API_URL}flowconfigupdate/${fid}/`,config);
  }

  getConfigByFlowId(fid: number){
    return this.http.get<DecisionFlow>(`${this.API_URL}flowconfigupdate/${fid}/`);
  }

  exportTestFlowTable(config: any){
    return this.http.post(`${this.API_URL}exportresult/`,config, { responseType: 'arraybuffer' });
  }

}

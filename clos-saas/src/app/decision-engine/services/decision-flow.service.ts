import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DecisionFlow, FlowTasks, Scenario } from '../models/DecisionFlow';
import { Scorecard, scoreCardTable, ScoreCardVariables } from '../models/scorecard';
import { VariablesList } from '../models/Variables';
import { ThemeSelectionService } from './theme-selection.service';

@Injectable({
  providedIn: 'root'
})
export class DecisionFlowService {

  API_URL: string = '';
  API_URLS: string = '';
  saveUpdate: boolean = false;
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
    this.API_URLS = this.configurationService.apiUrl().services.flow_manager_data_service;
  }

  //FOR CREATE DECISION FLOW WITH START AND END NODE
  createDecisionFlow(decisionFlow: DecisionFlow) {
    return this.http.post<DecisionFlow>(`${this.API_URL}decisionflowcreate/`, decisionFlow)
  }

  // FOR GET SPECIFIC FLOW
  getListOfFlow(pageNum: number, pageSize: number) {
    return this.http.get<DecisionFlow[]>(`${this.API_URL}decisionflow/?page=${pageNum}&page_size=${pageSize}`)
  }

  // FOR GET ALL THE FLOWS
  getListFlows() {
    return this.http.get<DecisionFlow[]>(`${this.API_URL}decision_Flow/`);
  }

  // FOR GET SPECIFIC FLOWTASK DETAIL
  getFlowTaskData(id: any) {
    return this.http.get<FlowTasks>(`${this.API_URL}flowtaskdetail/${id}/`)
  }

  //FOR EDIT UPDATE FLOWTASK
  updateFlowTask(flowTask: any, id: number) {
    return this.http.put<FlowTasks>(`${this.API_URL}flowtaskdetail/${id}/`, flowTask)
  }

  //FOR DECISIONFLOW DETAILS BY FLOW ID
  getDecisionTaskByFlowId(id: number) {
    return this.http.get<DecisionFlow>(`${this.API_URL}decisionflowdetail/${id}/`)
  }
  //FOR DECISIONFLOW UPDATE BY FLOW ID
  updateDecisionTaskByFlowId(id: number, decisionflow: DecisionFlow) {
    return this.http.put<DecisionFlow>(`${this.API_URL}decisionflowdetail/${id}/`, decisionflow)
  }

  //FOR CREATE FLOWTASK  
  getTaskId(data: any, id: number) {
    return this.http.put<FlowTasks>(`${this.API_URL}decisionflowdetail/${id}/`, data)
  }

  //FOR DELETE DECISIONFLOW
  deleteDecisionFlow(id: number) {
    return this.http.delete(`${this.API_URL}decisionflowdetail/${id}/`)
  }
  //FOR DELETE FLOWTASK
  deleteDecisionFlowTask(id: number, data: any) {
    console.log(data);
    return this.http.put(`${this.API_URL}taskDelete/${id}/`, data)
  }
  // TO LIST VARIABLES
  getVariablesList() {
    return this.http.get<VariablesList>(`${this.API_URL}variableslist/`)

  }

  // TO GET SCENARIOS
  getScenariosList() {
    return this.http.get<Scenario[]>(`${this.API_URL}scenariolist/`)

  }

  // SCORE CARD API
  // VARIABLE LIST
  getSearchFunction(keyword: string) {
    return this.http.get(`${this.API_URLS}/search?keyword=${keyword}`);
  }

  // LIST OF TABLE
  getListOfTable() {
    return this.http.get<Scorecard[]>(`${this.API_URL}getScoreSetList/`);
  }

  //   // CREATE SCORE CARD
  //   createScorecard(scoreCardTable: Scorecard){
  //     return this.http.post<Scorecard>(`${this.API_URL}scoresetcreate/`, scoreCardTable);
  //   }

  //   // DELETE SCORE CARD
  //   deleteScoreCard(id: number) {
  //     return this.http.delete(`${this.API_URL}scoresetdetail/${id}/`);
  //   }

  //   // SAVE SCORE CARD
  //   updateScoreCard(id: number,data: scoreCardTable[]) {
  //     return this.http.put<scoreCardTable[]>(`${this.API_URL}scorecardsetupdate/${id}/`,data);
  //   }

  //   // FETCH SCORE CARD
  //   getScoreCard(id: number) {
  //     return this.http.get<scoreCardTable[]>(`${this.API_URL}scoresetdetail/${id}/`);
  //   }

  //   // PUT SCORE CARD VARIABLES
  //   putScoreCard(id: string,scoreCard: ScoreCardVariables) {
  //     return this.http.put<ScoreCardVariables>(`${this.API_URL}scoresetdetail/${id}/`,scoreCard);
  //   }

  // DELETE VARIABLES
  deleteVariables(id: string) {
    return this.http.delete(`${this.API_URL}scorecardUpdatePid/${id}/`);
  }

  // DELETE BINS
  deleteBins(id: number) {
    return this.http.delete(`${this.API_URL}scorecardconditiondelete/${id}/`);
  }

  // GET VALUES
  getValues(id: string, table) {
    return this.http.put(`${this.API_URL}scorecardconditionUpdate/${id}/`, table)
  }

  // UPDATE PARTIAL SCORE
  updatePartialScore(id: number, partialScore) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(`${this.API_URL}scorecardScoreChange/${id}/`, partialScore, { headers: headers })
  }
  // // FETCH VARIABLE LIST
  // getVariableList() {
  //   return this.http.get<scoreCardTable[]>(`${this.API_URL}variableslist/`);
  // }

  // DELETE PUT
  putDeleteList(id: number, data: any) {
    return this.http.put(`${this.API_URL}VariableDataUpadte/${id}/`, data);
  }
  //FOR IMPORT DECISION FLOW FROM FILE
  importDecisionFlow(data: any) {
    return this.http.post<DecisionFlow>(`${this.API_URL}decisionflowimport/`, data)
  }

  //to search score card

getSearchDecisionFlow(searchName:string){
  return this.http.get(`${this.API_URL}searchdecisionflow/?search=${searchName}`)
}

}

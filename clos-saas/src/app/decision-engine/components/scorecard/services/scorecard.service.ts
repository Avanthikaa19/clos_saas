import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { Scorecard, scoreCardTable, ScoreCardVariables } from "../models/scorecard-models";

@Injectable({
    providedIn: 'root'
  })
  
export class ScorecardService {

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

  // VARIABLE LIST
  getSearchFunction(keyword: string) {
    return this.http.get(`${this.API_URLS}/search?keyword=${keyword}`);
  }

  // LIST OF TABLE
  getListOfTable(pageNum: number, pageSize: number){
    return this.http.get<Scorecard[]>(`${this.API_URL}scoresetlists/?page=${pageNum}&page_size=${pageSize}`);
  }

  // CREATE SCORE CARD
  createScorecard(scoreCardTable: Scorecard){
    return this.http.post<Scorecard>(`${this.API_URL}scoresetcreate/`, scoreCardTable);
  }

  // DELETE SCORE CARD
  deleteScoreCard(id: number) {
    return this.http.delete(`${this.API_URL}scoresetdetail/${id}/`);
  }

  // SAVE SCORE CARD
  updateScoreCard(id: number,data: scoreCardTable[]) {
    return this.http.put<scoreCardTable[]>(`${this.API_URL}scorecardsetupdate/${id}/`,data);
  }

  // FETCH SCORE CARD
  getScoreCard(id: number) {
    return this.http.get<scoreCardTable[]>(`${this.API_URL}scoresetdetail/${id}/`);
  }

  // PUT SCORE CARD VARIABLES
  putScoreCard(id: string,scoreCard: ScoreCardVariables) {
    return this.http.put<ScoreCardVariables>(`${this.API_URL}scoresetdetail/${id}/`,scoreCard);
  }

  // DELETE VARIABLES
  deleteVariables(id: string) {
    return this.http.delete(`${this.API_URL}scorecardUpdatePid/${id}/`);
  }

  // DELETE BINS
  deleteBins(id:number) {
    return this.http.delete(`${this.API_URL}scorecardconditiondelete/${id}/`);
  }

  // GET VALUES
  getValues(id: string,table){
    return this.http.put(`${this.API_URL}scorecardconditionUpdate/${id}/`,table)
  }

  // UPDATE PARTIAL SCORE
  updatePartialScore(id: number,partialScore) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(`${this.API_URL}scorecardScoreChange/${id}/`,partialScore,{headers:headers})
  }
// FETCH VARIABLE LIST
getVariableList() {
  return this.http.get<scoreCardTable[]>(`${this.API_URL}variableslist/`);
}

// DELETE PUT
putDeleteList(id:number, data: any) {
  return this.http.put(`${this.API_URL}VariableDataUpadte/${id}/`, data);
}

//to search score card

getSearchScoreCard(searchName:string){
  return this.http.get(`${this.API_URL}searchscorecard/?search=${searchName}`)
}
 
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { RuleSet, Rules, Conditions } from "../models/rulesetmodels";

@Injectable({
  providedIn: 'root'
})
export class RuleEngineService {

  API_URL: string = '';
  saveUpdate: boolean = false;
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getRuleSetList(pid: number, pageNum: number, pageSize: number) {
    return this.http.get<RuleSet[]>(`${this.API_URL}rulesetlists/?page=${pageNum}&page_size=${pageSize}`);
  }

  createRuleSet(ruleSet: RuleSet) {
    return this.http.post<RuleSet>(`${this.API_URL}rulesetcreate/`, ruleSet);
  }

  // updateRuleSet(rsId: number){
  //   return this.http.get<Rules[]>(`${this.API_URL}rulesdetail/${rsId}/`);
  // }

  getRulesList() {
    return this.http.get<Rules[]>(`${this.API_URL}ruleslist/`);
  }

  createRule(rule: Rules) {
    return this.http.post<Rules[]>(`${this.API_URL}ruleslist/`, rule);
  }

  getRuleSetById(rsId: number) {
    return this.http.get<RuleSet>(`${this.API_URL}rulesetdetail/${rsId}/`);
  }

  updateRuleSetById(rsId: number, ruleSet: any) {
    return this.http.put<RuleSet>(`${this.API_URL}rulesetdetail/${rsId}/`, ruleSet);
  }

  deleteRule(rsId: number) {
    return this.http.delete(`${this.API_URL}rulesdetail/${rsId}/`);
  }

  getRulesPidList(pid: number, pageNum: number, pageSize: number) {
    return this.http.get<Rules[]>(`${this.API_URL}rulesListPid/?page=${pageNum}&page_size=${pageSize}`);
  }

  getRulePidList() {
    return this.http.get<Rules[]>(`${this.API_URL}getRulesList/`);
  }

  createRulesPid(rule: Rules) {
    return this.http.post<Rules>(`${this.API_URL}rulesCreatePid/`, rule);
  }
  updateRule(rid: number, rule: any) {
    return this.http.put<Rules>(`${this.API_URL}rulesUpdatePid/${rid}/`, rule);
  }
  getRuleById(pid: number, rlid: number) {
    return this.http.get<Rules>(`${this.API_URL}rulesListPid/?rlid=${rlid}`);
  }
  createRulesConditions(conditions: Conditions) {
    return this.http.post<Rules>(`${this.API_URL}rulesconditions/`, conditions);
  }

  deleteRuleset(rsId: number) {
    return this.http.delete(`${this.API_URL}rulesetdetail/${rsId}/`);
  }
  saveruleset(rsId: number, ruleset: RuleSet) {
    return this.http.put<RuleSet>(`${this.API_URL}rulesetupdate/${rsId}/`, ruleset);
  }


    //to search rules

    getSearchRules(searchName:string){
      return this.http.get(`${this.API_URL}searchrules/?search=${searchName}`)
    }


    //to search rules set

    getSearchRulesSet(searchName:string){
      return this.http.get(`${this.API_URL}searchruleset/?search=${searchName}`)
    }

}

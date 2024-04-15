import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Conditions, Rules, RuleSet } from '../models/RuleEngine';

@Injectable({
  providedIn: 'root'
})
export class RuleEngineService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  // DECISION FLOW -> ASSIGN NODE -> TYPE FIELD CHANGE GET API
  getRuleSetList(pid: number) {
    return this.http.get<RuleSet[]>(`${this.API_URL}getRuleSetList/`);
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

  getRulesPidList(pid: number) {
    return this.http.get<Rules[]>(`${this.API_URL}rulesListPid/`);
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
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { allVariableData, Variables } from "../models/variable-models";

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  API_URL: string = '';
  saveUpdate: boolean = false;
  selectedProjectId: number = +sessionStorage.getItem("ProjectId");

  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getVariables(pageNum: number, pageSize: number) {
    return this.http.get<Variables[]>(`${this.API_URL}variable_lists/?page=${pageNum}&page_size=${pageSize}`);
  }

  getvariableslist(){
    return this.http.get<any[]>(`${this.API_URL}variableslist/`);  
  }

  deleteVariable(id: number) {
    return this.http.delete<Variables>(`${this.API_URL}variablesdetail/${id}/`)
  }

  createVariables(variable: Variables) {
    return this.http.post<Variables>(`${this.API_URL}variablescreate/`, variable)
  }

  updateVariables(id: number, variable: Variables) {
    return this.http.put<Variables>(`${this.API_URL}variablesdetail/${id}/`, variable)
  }

  gettVariable(id: number) {
    return this.http.get<allVariableData>(`${this.API_URL}variablesdetail/${id}/`)
  }

  getVariableField(tableName: string) {
    return this.http.get<Variables>(`${this.API_URL}actionVariableList/${tableName}/`)
  }
  getVariableTableField(tableName: string) {
    return this.http.get<Variables>(`${this.API_URL}getVariableFields/${tableName}/`)
  }
  getChoosefield(id: number, variable: Variables) {
    return this.http.get<Variables>(`${this.API_URL}fetchActionVariables/${id}/`, variable)
  }
  getChooseLogic() {
    return this.http.get<any>(`${this.API_URL}dropdownList/`)
  }
  getTableField(tableName: string) {
    return this.http.get<any>(`${this.API_URL}conditionalVariablesList/${tableName}/`)

  }
  // decision table dropdown
  getDecicionTable() {
    return this.http.get<any>(`${this.API_URL}getdecisiontable/`)
  }
  createVariableData(variable: allVariableData) {
    return this.http.post<Variables>(`${this.API_URL}variablescreate/`, variable)
  }
  updateVariableData(id: number,variable: allVariableData) {
    return this.http.put<Variables>(`${this.API_URL}variablesdetail/${id}/`, variable)
  }


    //to search decision table standards

    getSearchVariable(searchName:string){
      return this.http.get(`${this.API_URL}searchvariables/?search=${searchName}`)
    }
}

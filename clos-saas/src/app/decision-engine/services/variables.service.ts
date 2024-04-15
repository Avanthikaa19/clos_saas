import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { VariableLibrary, Variables } from '../models/Variables';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getVariables() {
    return this.http.get<Variables[]>(`${this.API_URL}variableslist/`);
  }
  
  createVariables(variable: Variables) {
    return this.http.post<Variables>(`${this.API_URL}variablescreate/`, variable)
  }
  gettVariable(id: number) {
    return this.http.get<Variables>(`${this.API_URL}variablesdetail/${id}/`)
  }
  updateVariables(id: number, variable: Variables) {
    return this.http.put<Variables>(`${this.API_URL}variablesdetail/${id}/`, variable)
  }
  deleteVariable(id: number) {
    return this.http.delete<Variables>(`${this.API_URL}variablesdetail/${id}/`)
  }
  deleteVariableLib(id: number) {
    return this.http.delete<VariableLibrary>(`${this.API_URL}variablelibrarydetail/${id}/`)
  }
  getVariableLibraryList(pid: number) {
    return this.http.get<VariableLibrary[]>(`${this.API_URL}variableliblists/`);
  }
  createVariableLibrary(varLib: VariableLibrary) {
    return this.http.post<VariableLibrary>(`${this.API_URL}variablelibrarycreate/`, varLib);
  }
  getVariableLibraryById(varLibId: number) {
    return this.http.get<VariableLibrary>(`${this.API_URL}variablelibrarydetail/${varLibId}/`);
  }

  updateVariableLibraryById(vlId: number, varLib: any) {
    return this.http.put<VariableLibrary>(`${this.API_URL}variablelibrarydetail/${vlId}/`, varLib);
  }

  // updateVariablesLibraryById(vlId: number, varLib: any){
  //   return this.http.put<VariableLibrary>(`${this.API_URL}libraryUpdate/${vlId}/`,varLib);
  // }
  getVariablesList() {
    return this.http.get<Variables[]>(`${this.API_URL}variableslisting/`);
  }


}

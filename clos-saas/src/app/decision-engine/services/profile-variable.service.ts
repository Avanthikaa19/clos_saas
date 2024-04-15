import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ProfileVariable } from '../models/ProfileVariable';
@Injectable({
  providedIn: 'root'
})
export class ProfileVariableService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getProfiles() {
    return this.http.get<ProfileVariable>
      (`${this.API_URL}profileslist/`);
  }
  
  createProfile(profile: ProfileVariable) {
    return this.http.post<ProfileVariable>(`${this.API_URL}profilescreate/`, profile)
  }
  getProfile(id: number) {
    return this.http.get<ProfileVariable>(`${this.API_URL}profilesdetail/${id}/`)
  }
  updateProfiles(id: number, profile: ProfileVariable) {
    return this.http.put<ProfileVariable>(`${this.API_URL}profilesdetail/${id}/`, profile)
  }
  deleteProfile(id: number) {
    return this.http.delete<ProfileVariable>(`${this.API_URL}profilesdetail/${id}/`)
  }
  runProfile(profile: ProfileVariable) {
    return this.http.post<ProfileVariable>(`${this.API_URL}profilingExecution/`, profile)
  }
 confiigureFlow(profile:any){
  return this.http.post<any>(`${this.API_URL}configureProfile/`, profile)

 }
 getTables(profile:any){
  return this.http.post<any>(`${this.API_URL}getDatabaseTables/`, profile)

 }
  getProfilesList() {
    return this.http.get<ProfileVariable[]>(`${this.API_URL}Profileslisting/`);
  }


}

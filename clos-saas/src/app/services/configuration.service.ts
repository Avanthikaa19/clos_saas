import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiUrlMap} from "../models/ApiUrlMapModel";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../admin/components/users/models/User';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  public static API_URL: string| '';
  public apiUrlMap: ApiUrlMap | undefined;
  public  test:any;
  // private readonly apiUrlMapPath: string = '/assets/config/api_url_map.json';
  production = environment.production;
  private readonly apiUrlMapPath: string = '/assets/config/api_url_map.json';
  private readonly apiUrlMapPathGUI: string = '/los-gui/assets/config/api_url_map.json';
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async loadConfigurations(): Promise<any> {
    let tradeLensURL: string = '';
    if(this.production){
      tradeLensURL = this.apiUrlMapPathGUI;
    }
    else{
      tradeLensURL = this.apiUrlMapPath;
    }
    try {
      console.log('Trade Lens URL',tradeLensURL)
      const response = await this.http.get<ApiUrlMap>(`${tradeLensURL}`).toPromise();
      if(response === undefined) {
        return;
      }
      this.apiUrlMap = {
        gateway: response.gateway,
        services: {
          auth_service: response.services.auth_service.replace('[gateway]', response.gateway),
          domain_data_service: response.services.domain_data_service.replace('[gateway]', response.gateway),
          user_data_service: response.services.user_data_service.replace('[gateway]', response.gateway),
          flow_manager_data_service: response.services.flow_manager_data_service.replace('[gateway]', response.gateway),
          flow_manager_execution_service: response.services.flow_manager_execution_service.replace('[gateway]', response.gateway),
          case_management_service: response.services.case_management_service.replace('[gateway]', response.gateway),
          dashboards_data_service: response.services.dashboards_data_service.replace('[gateway]', response.gateway),
          alert_configuration_data_service: response.services.alert_configuration_data_service.replace('[gateway]', response.gateway),
          decision_flow_execution_service: response.services.decision_flow_execution_service.replace('[gateway]', response.gateway),
          notification_data_service: response.services.notification_data_service.replace('[gateway]', response.gateway),
          audit_data_service: response.services.audit_data_service.replace('[gateway]', response.gateway),
          trades_data_service: response.services.trades_data_service.replace('[gateway]', response.gateway),
          alerts_data_service: response.services.alerts_data_service.replace('[gateway]', response.gateway),
          report_data_service: response.services.report_data_service.replace('[gateway]', response.gateway),
          market_data_service:response.services.market_data_service.replace('[gateway]',response.gateway),
          attachment_data_service: response.services.attachment_data_service.replace('[gateway]', response.gateway),
          loan_data_service: response.services.loan_data_service.replace('[gateway]', response.gateway),
          lo_monitor_service: response.services.lo_monitor_service.replace('[gateway]', response.gateway),
          clos_data_service: response.services.clos_data_service.replace('[gateway]', response.gateway),
          dynamic_dashboard_service: response.services.dynamic_dashboard_service.replace('[gateway]', response.gateway),
          saas_service:response.services.saas_service.replace('[gateway]', response.gateway),
        }
      };
      console.log({ apiUrlMap: this.apiUrlMap });
      console.log({ apiUrlMap: this.apiUrlMap.gateway });

      this.test=this.apiUrlMap.gateway;
      return this.apiUrlMap;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public apiUrl() {
    return this.apiUrlMap;
  }
  getConfigurations() {
    return this.http.get('assets/config/api_url_map.json', { responseType: 'text' as 'json'});
  }

  getUrl() {
    return this.http.get('assets/config/api_url_map.json', { responseType: 'text' as 'json'});
  }
  getUserAccessProfile(){
    return this.http.get<User>(`${this.apiUrl().services.domain_data_service}/domain/users/my-access-profile`);
  }

  getEnvName() {
    return this.http.get('assets/config/env.json', { responseType: 'text' as 'json'});
  }
}

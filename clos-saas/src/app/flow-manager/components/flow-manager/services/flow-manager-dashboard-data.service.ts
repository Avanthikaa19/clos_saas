import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
// import { UrlService } from 'src/app/services/http/url.service';
import { DFMAnalyticsDataRequest, DFMTLStatus, WorkflowNode } from '../models/models-v2';

@Injectable({
  providedIn: 'root'
})
export class FlowManagerDashboardDataService {
  API_URL: string = '';
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.flow_manager_data_service;
  }

  getWorkflowsSummary() {
    return this.http.get<WorkflowNode[]>(`${this.API_URL}/api/dfm/analytics/workflows`);
  }

  getTLServiceStatus() {
    return this.http.get<any>(`${this.API_URL}/api/dfm/tl/refresh/status`);
  }

  getAnalyticsServiceStatus() {
    return this.http.get<any>(`${this.API_URL}/api/dfm/analytics/refresh/status`);
  }

  //Systems Dashboard

  getTLStatus(worksheetIds: number[]) {
    return this.http.post<DFMTLStatus>(`${this.API_URL}/api/dfm/tl/systems`, worksheetIds);
  }

  //Analytics Dashboard

  forceRefreshAnalyticsForTheGivenDateRange(fromDate: string, toDate: string) {
    return this.http.get<{ message: string, started: boolean }>(`${this.API_URL}/api/dfm/analytics/refresh/from/${fromDate}/to/${toDate}`);
  }

  getHourlyAnalytics(dataRequest: DFMAnalyticsDataRequest) {
    return this.http.post<any>(`${this.API_URL}/api/dfm/analytics/hourly`, dataRequest);
  }

}

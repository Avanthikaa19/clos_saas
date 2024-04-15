import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { SystemStatus } from '../models/SystemStatus';

@Injectable({
  providedIn: 'root'
})
export class AppCoreDataService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.domain_data_service;
  }

  getStartTime() {
    return this.http.get<{ last_start_time: Date }>(`${this.API_URL}/api/start_time`);
  }

  restartApplication(password: string) {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/restart`, password);
  }

  getDCPStatus() {
    return this.http.get<{ running: boolean }>(`${this.API_URL}/api/dcp/status`);
  }

  startDCP() {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/dcp/start`, null);
  }

  stopDCP() {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/dcp/stop`, null);
  }

  getSystemStatuses(from: number) {
    return this.http.get<SystemStatus[]>(`${this.API_URL}/api/metrics/system-status/from/${from}`);
  }

  getLatestSystemStatus() {
    return this.http.get<SystemStatus>(`${this.API_URL}/api/metrics/system-status/latest`);
  }

  refreshMDIMSIntradayData() {
    return this.http.post<{ message: string, size: number }>(`${this.API_URL}/api/market-data/mdims/refresh-i`, null);
  }

  refreshMDIMSClosingData() {
    return this.http.post<{ message: string, size: number }>(`${this.API_URL}/api/market-data/mdims/refresh-c`, null);
  }

  loadBBFile(filepath: string, sampleMinutes: number) {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/market-data/bb/load-highlow?sampleMinutes=${sampleMinutes}`, filepath);
  }

  loadBBFWDFile(filepath: string, sampleMinutes: number) {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/market-data/bb/load-fwd-highlow?sampleMinutes=${sampleMinutes}`, filepath);
  }

  //METRICS
  getCPULoad() {
    return this.http.get<{
      cpu_usage: number,
      used_memory_mb: number;
      memory_usage: number,
      processors: number,
      total_memory_mb: number,
      active_connections: number,
      idle_connections: number,
      max_connections_allowed: number
    }>(`${this.API_URL}/api/metrics/cpu`);
  }

  getSystemStatusMetrics() {
    return this.http.get<SystemStatus[]>(`${this.API_URL}/api/metrics/sys-status/job-status`);
  }

  getThreadDump() {
    return this.http.get<{ threadDump: string }>(`${this.API_URL}/api/performance/thread-dump`);
  }

  getHeapDump(live: boolean) {
    return this.http.get(`${this.API_URL}/api/performance/heap-dump/${live}`, { responseType: 'arraybuffer' });
  }

  performGC() {
    return this.http.get(`${this.API_URL}/api/performance/gc`);
  }

}

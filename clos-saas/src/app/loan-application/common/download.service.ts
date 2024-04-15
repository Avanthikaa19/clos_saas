import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  API_URL: string = '';
  API_URLS: string = '';
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.loan_data_service;
   }

   getFileByJob(id: number) {
    return this.http.get(`${this.API_URL}jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }
}
export class DownloadJob {
  id: number;
  type: string;
  filePath: string;
  progressStage: string;
  progress: number;
  itemsProcessed: number;
  itemsTotal: number;
  isReady: boolean;
  username: string;
  requestTime: Date;
  readyTime: Date;
  hostname: string
}
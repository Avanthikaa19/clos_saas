import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
// import { UrlService } from '../http/url.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadDataService {

  API_URL: string = '';
  currentUser:string = '';
  AUDIT_API_URL: string = '';

  constructor(
    private http: HttpClient,
    public encryptDecryptService:EncryptDecryptService,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.domain_data_service;
    this.AUDIT_API_URL = this.configurationService.apiUrl().services.audit_data_service;
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=encryptDecryptService.decryptData(user)
  }

  getJobIsReady(id: number) {
    return this.http.get<{ isReady: boolean }>(`${this.API_URL}/downloads/jobs/${id}/is-ready?user=${this.currentUser}`);
  }
  getJob(id: number) {
    return this.http.get<DownloadJob>(`${this.AUDIT_API_URL}/downloads/jobs/${id}?user=${this.currentUser}`);
  }
  getFileByJob(id: number) {
    return this.http.get(`${this.API_URL}/downloads/jobs/${id}/get-file?user=${this.currentUser}`, { responseType: 'arraybuffer' });
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
}

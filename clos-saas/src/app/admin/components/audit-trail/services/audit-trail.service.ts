import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessControlData } from 'src/app/app.access';
import { ColumnDefinition } from 'src/app/c-los/models/clos-table';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AccessTemplate } from '../../access-templates/models/AccessTemplate';
import { AUTHENTICATED_USER } from '../../users/modals/user-detail/user-detail.component';
import { User } from '../../users/models/User';
import { DownloadJob } from '../../users/services/download-data.service';
import { AuditTrail, AuditTrailDetail, AuditTrailFilterSort, ExportFile } from '../models/AuditTrail';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {
  API_URL: any;
  AUDIT_API_URL: string = '';
  DOMAIN_API_URL: string = '';
  currentUser:string = '';
  constructor(
    private http: HttpClient,
    public encryptDecryptService:EncryptDecryptService,
    private configurationService: ConfigurationService,
  ) {
    this.AUDIT_API_URL = this.configurationService.apiUrl().services.audit_data_service;
    this.DOMAIN_API_URL = this.configurationService.apiUrl().services.domain_data_service;
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=encryptDecryptService.decryptData(user)
   }

  getAudit() {
    return this.http.get<AuditTrail[]>(`${this.configurationService.apiUrl().services.audit_data_service}/audit/modules`);
  }

  getAuditList(page: number, pageSize: number, module: any, moduleObj: any) {
    return this.http.get<{ records: number, pages: number, data: AuditTrail[] }>(`${this.configurationService.apiUrl().services.audit_data_service}/audit/?page=${page}&pageSize=${pageSize}&module=${module}&moduleObject=${moduleObj}`);
  }
  getFiltersByMultiSort(filterByMultiSort: AuditTrailFilterSort, page: number, pageSize: number,module: any, moduleObj: any) {
    return this.http.post<{ count: number,totalPages: number, data: AuditTrail[]}>(`${this.configurationService.apiUrl().services.audit_data_service}/audit/get/by-data-request?page=${page}&pageSize=${pageSize}&module=${module}&moduleObject=${moduleObj}`, filterByMultiSort);
  }
  getExportFile(filter: ExportFile, fileFormat: string,module: any, moduleObj: any){
    return this.http.post<DownloadJob>(`${this.configurationService.apiUrl().services.audit_data_service}/audit/by-filter/export?format=${fileFormat}&module=${module}&moduleObject=${moduleObj}`, filter);
  }
  getFileByJob(id: number) {
    return this.http.get(`${this.configurationService.apiUrl().services.audit_data_service}/downloads/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }
  getAuditTrailLogs(columns:ColumnDefinition[],page:number, pageSize: number,module:string,isView:boolean,auditobj:string,Object:string){
    return this.http.post<{data:AuditTrailDetail[],count:number,totalPages: number}>(`${this.AUDIT_API_URL}/audit/by-filter?pageNum=${page}&pageSize=${pageSize}&auditObject=${auditobj}&view=${isView}&module=${module}&object=${Object}`,columns)
  }
  getAuditTraildropdown(page: number, pageSize: number, column: string, search: string){
   
    return this.http.get<any>(`${this.AUDIT_API_URL}/audit/dropdown?page=${page}&pageSize=${pageSize}&column=${column}&search=${search}&user=${this.currentUser}`);
 }

 exportAuditActivityLogs(columns:ColumnDefinition[],format:string){
  return this.http.post<any>(`${this.AUDIT_API_URL}/audit/by-filter/export?format=${format}`,columns)
}
 
getJob(id: number) {
  return this.http.get<DownloadJob>(`${this.AUDIT_API_URL}/downloads/jobs/${id}`);
}
getUserListingReportsDropdown(page: number, pageSize: number, column: string, search: string){
  return this.http.get<any>(`${this.DOMAIN_API_URL}/domain/users/dropdown?page=${page}&pageSize=${pageSize}&column=${column}&search=${search}&user=${this.currentUser}`);
}
getUsersListingReports(columns:ColumnDefinition[],page:number, pageSize: number){
  return this.http.post<{data:User[],count:number,totalPages: number}>(`${this.DOMAIN_API_URL}/domain/users/gets?page=${page}&pageSize=${pageSize}`,columns)
}
getAccessmatrixList(columns:ColumnDefinition[],page:number, pageSize: number,isView:boolean){
  return this.http.post<{data:any[],count:number,totalPages: number}>(`${this.DOMAIN_API_URL}/domain/roles/get/access_matrix?page=${page}&pageSize=${pageSize}&view=${isView}`,columns)
}
getAccessMatrixReportsDropdown(page: number, pageSize: number, column: string, search: string){
  return this.http.get<any>(`${this.DOMAIN_API_URL}/domain/roles/dropdown?page=${page}&pageSize=${pageSize}&column=${column}&search=${search}`);
}
exportAccessMatrix(columns:ColumnDefinition[],format:string){
  return this.http.post<any>(`${this.DOMAIN_API_URL}/domain/roles/export?format=${format}`,columns)
}
exportUserList(columns:ColumnDefinition[],format:string){
  return this.http.post<any>(`${this.DOMAIN_API_URL}/domain/users/export/column?format=${format}`,columns)
}
getFile(id: number) {
  return this.http.get(`${this.DOMAIN_API_URL}/downloads/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
}
getJobId(id: number) {
  return this.http.get<DownloadJob>(`${this.DOMAIN_API_URL}/downloads/jobs/${id}?user=${this.currentUser}`);
}
}

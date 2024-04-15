import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
//import { ColumnDefinition } from 'src/app/alert-manager/components/common/data-table/data-table.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DownloadJob } from '../../users/services/download-data.service';
import { AccessTemplate, accessTemplatesort, ExportFile } from '../models/AccessTemplate';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  accessDetail: AccessTemplate;
  API_URL: string = '';
  AUDIT_API_URL: string = '';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.domain_data_service;
    this.AUDIT_API_URL = this.configurationService.apiUrl().services.audit_data_service;
  }

  getAccessTemplateByName(templateName: string,page: number, pageSize: number){
    return this.http.get<{ count: number, totalPages: number, data: AccessTemplate[] }>(`${this.API_URL}/domain/access_templates/get/by-accesstemplate-name?name=${templateName}&page=${page}&pageSize=${pageSize}`);
  }
  getAccessTemplateList(page: number, pageSize: number) {
    return this.http.get<{ count: number, totalPages: number, data: AccessTemplate[] }>(`${this.API_URL}/domain/access_templates/?page=${page}&pageSize=${pageSize}`);
  }
  createAccessTemplate(accessTemplate: AccessTemplate) {
    return this.http.post<AccessTemplate[]>(`${this.API_URL}/domain/access_templates/`, accessTemplate);
  }
  editAccessTemplate(id: number, accessTemplate: AccessTemplate) {
    return this.http.put<AccessTemplate[]>(`${this.API_URL}/domain/access_templates/${id}/update`, accessTemplate);
  }
  getAccessItems() {
    return this.http.get<any[]>(`${this.API_URL}/domain/access_templates/access_items`);
  }

  getAccessTemplateGroups(id: number, page: number, pageSize: number) {
    return this.http.get<any>(`${this.API_URL}/domain/access_templates/groups/${id}?page=${page}&pageSize=${pageSize}`);
  }

  getAccessTemplateRoles(id: number, page: number, pageSize: number) {
    return this.http.get<any>(`${this.API_URL}/domain/access_templates/roles/${id}?page=${page}&pageSize=${pageSize}`);
  }
  deleteAccessTemplateRoles(id: number) {
    return this.http.delete(`${this.API_URL}/domain/access_templates/${id}/delete`, { responseType: 'text' });

  }
  filterAccessTemplateTable(page: number, pageSize: number, filterData: any, orderBy: string, order: string) {
    return this.http.post<{ count: number, totalPages: number, data: AccessTemplate[] }>(`${this.API_URL}/domain/access_templates/get?page=${page}&pageSize=${pageSize}&order=${order}&orderBy=${orderBy}`, filterData);
  }

  getFiltersByMultiSort(filterByMultiSort:accessTemplatesort, page: number, pageSize: number) {
    return this.http.post<{ count: number, totalPages: number, data: AccessTemplate[] }>
    (`${this.API_URL}/domain/access_templates/get/by-data-request?page=${page}&pageSize=${pageSize}`, filterByMultiSort);
  }
 
  //get & set user 
  getAccessTemplate(userInput: AccessTemplate) {
    this.accessDetail = userInput;
  }
  setAccessTemplate() {
    return this.accessDetail;
  }
  getExportFile(filter: ExportFile, fileFormat: string){
    return this.http.post<DownloadJob>(`${this.API_URL}/domain/access_templates/by-filter/export?format=${fileFormat}`, filter);
  }
  getFileByJob(id: number) {
    return this.http.get(`${this.API_URL}/downloads/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }

  // ACCESS TEMPLATE LISTING API USING COLUMN DEFINITION 
  accessTemplateList(columns: ColumnDefinition[],page: number,pageSize: number) {
    return this.http.post<ColumnDefinition[]>(`${this.API_URL}/domain/access_templates/gets?page=${page}&pageSize=${pageSize}`, columns);
  }
   
// FILTER DROP DOWNS API 
getDropdownList(page: number, pageSize: number, column: string, search: string) {
  return this.http.get(`${this.API_URL}/domain/access_templates/dropdown?page=${page}&pageSize=${pageSize}&columnName=${column}&search=${search}`);
}


//ACCESS TEMPLATE LISTING SCREEN EXPORT APIS
// EXPORT API  
accessTemplateListExport(columns: ColumnDefinition[],format:string) {
  return this.http.post<any>(`${this.API_URL}/domain/access_templates/export/column?format=${format}`, columns);
}

// audit listing
 auditColumnList(columns: ColumnDefinition[],pageNum: number, pageSize: number,module:string,view:boolean) {
  return this.http.post<ColumnDefinition[]>(`${this.AUDIT_API_URL}/audit/by-filter?pageNum=${pageNum}&pageSize=${pageSize}&module=${module}&view=${view}`,columns);
}

// audit export
auditTrailListExport(columns: ColumnDefinition[],format:string,module:string) {
  return this.http.post<any>(`${this.AUDIT_API_URL}/audit/by-filter/export?format=${format}&module=${module}`, columns);
}
getJob(id: number) {
  return this.http.get<DownloadJob>(`${this.AUDIT_API_URL}/downloads/jobs/${id}`);
}
getFilesByJob(id: number) {
  return this.http.get(`${this.AUDIT_API_URL}/downloads/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
}
}

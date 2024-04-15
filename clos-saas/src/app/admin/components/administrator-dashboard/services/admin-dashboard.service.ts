import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { audit, Count } from '../models/counts-model';
import { managerUserFilter } from '../../users/models/User';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  API_URL: string = '';
  API_URLs: string = '';
  Url: string = '';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.domain_data_service;
    this.API_URLs = this.configurationService.apiUrl().services.loan_data_service; 
    this.Url = this.configurationService.apiUrl().services.audit_data_service;
  }

  getCount(){
    return this.http.get<Count>(`${this.API_URL}/domain/users/users-roles-count`);
    // return this.http.get<Count>(`${this.API_URL}/dashboard/admin/counts`);
  }

  getMonthyUserReportChart(){
    return this.http.get<any>(`${this.API_URL}/domain/users/getMonthlyReportData`);
  }

  // getApproval(){
  //   return this.http.get<any>(`${this.API_URL}/dashboard/admin/approvals`);
  // }

  // To Get All Possible Fields for Duplicate Comparison
  getPossibleFields() {
    return this.http.get<any>(`${this.API_URLs}/findDuplicates/getPossibleMatchableFields`);
  }

  // To Modify the Checked and Unchecked Fields
  putFields(id: number,table) {
    return this.http.put(`${this.API_URL}/update/checkedFields?id=${id}`,table);
  }

  // To Get Checked Fields
  getChecked(id: number) {
    return this.http.get<any>(`${this.API_URL}/get/checkedFields?id=${id}`);
  }

  // Get All Audit
  getAudit(column:ColumnDefinition[],pageNum: number,pageSize: number,modules: string,object: string,auditObject: string,view: boolean) {
    return this.http.post<ColumnDefinition>(`${this.Url}/audit/by-filter?pageNum=${pageNum}&pageSize=${pageSize}&module=${modules}&object=${object}&auditObject=${auditObject}&view=${view}`,column)
  }
  //To get muliple select 
  getMultiSelect(page: number,pageSize:number,column:string,search:string,user:string) {
    return this.http.get<any>(`${this.API_URL}/domain/users/dropdown?page=${page}&pageSize=${pageSize}&column=${column}&search=${search}&user=${user}`);
  }
  
   //To get roles dropdown
 getRolesdropdown(page: number,pageSize:number,column:string,search:string,) {
  return this.http.get<any>(`${this.API_URL}/domain/roles/dropDown?page=${page}&pageSize=${pageSize}&columnName=${column}&search=${search}`);
}

  //To post multiple select
    postMultiSelect(page: number,pageSize:number,managerfilter:managerUserFilter) {
    return this.http.post<any>(`${this.API_URL}/domain/users/gets?page=${page}&pageSize=${pageSize}`,[managerfilter]);
  }

// FILTER DROP DOWNS API 
getDropdownList(page: number, pageSize: number, column: string, search: string) {
  return this.http.get(`${this.Url}/audit/dropdown?page=${page}&pageSize=${pageSize}&column=${column}&search=${search}`);
}


//ACCESS TEMPLATE LISTING SCREEN EXPORT APIS
// EXPORT API  
accessTemplateListExport(columns: ColumnDefinition[],format:string) {
  return this.http.post<any>(`${this.API_URL}/domain/access_templates/export/column?format=${format}`, columns);
}
}

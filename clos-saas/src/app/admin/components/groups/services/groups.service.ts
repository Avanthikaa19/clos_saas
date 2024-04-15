import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { Role } from '../../roles/models/Role';
import { User } from '../../users/models/User';
import { DownloadJob } from '../../users/services/download-data.service';
import { ExportFile, Group, GroupFilter, GroupsFilterSort, RoleTemplate, RoleTemplateFilterSort } from '../models/Group';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  groupDetail: any;
  API_URL: string = '';
  ALERT_API_URL: string = '';
  currentUser:string = '';

  constructor(
    private http: HttpClient,
    public encryptDecryptService:EncryptDecryptService,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.domain_data_service;
    this.ALERT_API_URL = this.configurationService.apiUrl().services.alerts_data_service;
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=encryptDecryptService.decryptData(user)
  }

  getGroupsList(page: number, pageSize: number) {
    return this.http.get<{ count: number, totalPages: number, data: Group[] }>(`${this.API_URL}/group/?page=${page}&pageSize=${pageSize}`);
  }
  createGroup(group: Group) {
    return this.http.post<Group[]>(`${this.API_URL}/group/`,group);
  }
  editGroup(group: Group) {
    return this.http.put<Group[]>(`${this.API_URL}/group/update`, group);
  }
  
  //get & set group
  getGroup(groupInput: Group) {
    this.groupDetail = groupInput;
  }
  setGroup() {
    return this.groupDetail;
  }

  getRoleTemplate(page: number, pageSize: number) {
    return this.http.get<{ count: number, totalPages: number, data: RoleTemplate[] }>
      (`${this.API_URL}/domain/role_templates/?page=${page}&pageSize=${pageSize}`);
  }
  createRoleTemplate(roleTemplate: RoleTemplate) {
    return this.http.post<RoleTemplate>
      (`${this.API_URL}/domain/role_templates/`, roleTemplate);
  }

  updateRoleTemplate(id: number, roleTemplate: RoleTemplate) {
    return this.http.put<RoleTemplate>
      (`${this.API_URL}/domain/role_templates/${id}/update`, roleTemplate);
  }

  getRoles() {
    return this.http.get<Role[]>(`${this.API_URL}/domain/roles/all-roles`)
  }

  deleteGroup(id: number) {
    return this.http.delete(`${this.API_URL}/domain/groups/${id}/delete`, { responseType: 'text' });
  }

  filterGroupsTable(page: number, pageSize: number, filterData: any, orderBy: string, order: string) {
    return this.http.post<{ count: number, totalPages: number, data: Group[] }>(`${this.API_URL}/domain/groups/get?page=${page}&pageSize=${pageSize}&order=${order}&orderBy=${orderBy}`, filterData);
  }

  getFiltersByMultiSort(filterByMultiSort: GroupsFilterSort, page: number, pageSize: number) {
    return this.http.post<{ count: number, totalPages: number, data: Group[] }>
    (`${this.API_URL}/domain/groups/get/by-data-request?page=${page}&pageSize=${pageSize}`, filterByMultiSort);
  }

  getRoleTemplateFiltersByMultiSort(filterByMultiSort: RoleTemplateFilterSort, page: number, pageSize: number) {
    return this.http.post<{ count: number, totalPages: number, data: RoleTemplate[] }>
    (`${this.API_URL}/domain/role_templates/get/by-data-request?page=${page}&pageSize=${pageSize}`, filterByMultiSort);
  }

  
  getExportFile(filter: ExportFile, fileFormat: string){
    return this.http.post<DownloadJob>(`${this.API_URL}/domain/groups/by-filter/export?format=${fileFormat}`, filter);
  }

  getFileByJob(id: number) {
    return this.http.get(`${this.API_URL}/downloads/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }
  getUsersList(groupName:string) {
    return this.http.get<User[]>(`${this.API_URL}/domain/groups/users/by/GroupName?name=${groupName} `);
  }
  getCountryList(){
    return this.http.get<string[]>(`${this.ALERT_API_URL}/alerts/trades/dropdown?page=1&pageSize=150&column=country&search=&user=${this.currentUser} `);
  }

 // Groups LISTING API USING COLUMN DEFINITION 
 GroupsListingDataList(columns: ColumnDefinition[], pageNum: number, pageSize: number) {
  return this.http.post<ColumnDefinition[]>(`${this.API_URL}/group/gets?pageNum=${pageNum}&pageSize=${pageSize}`, columns);
}
  // GROUP EXPORT
  groupsListExport(columns: ColumnDefinition[], format: string) {
    return this.http.post<any>(`${this.API_URL}/group/by-filter/export?format=${format}`, columns);
  }
  // FILTER DROP DOWNS API
  getGroupDropdownList(page: number, pageSize: number, column: string, search: string) {
    return this.http.get(`${this.API_URL}/group/dropDown?page=${page}&pageSize=${pageSize}&columnName=${column}&search=${search}`);
  }

  getGroupsListNameSearch(page: number, pageSize: number, name: string) {
    return this.http.post<{count: number, totalPages: number, data: Group[] }>(`${this.API_URL}/group/get/by-name-request?name=${name}&page=${page}&pageSize=${pageSize}`, name);
  }
}
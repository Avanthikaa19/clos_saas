import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DownloadJob } from '../../users/services/download-data.service';
import { ExportFile, Role, RoleFilter, RolesFilterSort } from '../models/Role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  roleDetail: any;
  API_URL: string = '';


  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.domain_data_service;
  }
  getRolesList(page: number, pageSize: number) {
    return this.http.get<{ count: number, totalPages: number, data: Role[] }>(`${this.API_URL}/domain/roles/?page=${page}&pageSize=${pageSize}`);
  }
  createRole(role: Role) {
    return this.http.post<any>(`${this.API_URL}/domain/roles/`, role);
  }
  editRole(id: number, role: Role) {
    return this.http.put<Role[]>(`${this.API_URL}/domain/roles/${id}/update`, role);
  }
  deleteRole(id: number) {
    return this.http.delete(`${this.API_URL}/domain/roles/${id}/delete`, { responseType: 'text' });
  }
  filterRolesTable(page: number, pageSize: number, filterData: any, orderBy: string, order: string) {
    return this.http.post<{ count: number, totalPages: number, data: Role[] }>(`${this.API_URL}/domain/roles/get?page=${page}&pageSize=${pageSize}&order=${order}&orderBy=${orderBy}`, filterData);
  }
  getFiltersByMultiSort(filterByMultiSort: RolesFilterSort, page: number, pageSize: number) {
    return this.http.post<{ count: number, totalPages: number, data: Role[] }>
      (`${this.API_URL}/domain/roles/get/by-data-request?page=${page}&pageSize=${pageSize}`, filterByMultiSort);
  }

  getExportFile(filter: ExportFile, fileFormat: string) {
    return this.http.post<DownloadJob>(`${this.API_URL}/domain/roles/by-filter/export?format=${fileFormat}`, filter);
  }

  getFileByJob(id: number) {
    return this.http.get(`${this.API_URL}/downloads/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }


  //get & set role
  getRole(roleInput: Role) {
    this.roleDetail = roleInput;
  }
  setRole() {
    return this.roleDetail;
  }

  // ROLES  LISTING API USING COLUMN DEFINITION 
  rolesListingDataList(columns: ColumnDefinition[], page: number, pageSize: number) {
    return this.http.post<ColumnDefinition[]>(`${this.API_URL}/domain/roles/gets?page=${page}&pageSize=${pageSize}`, columns);
  }

  // FILTER DROP DOWNS API 
  getDropdownList(page: number, pageSize: number, column: string, search: string) {
    return this.http.get(`${this.API_URL}/domain/roles/dropDown?page=${page}&pageSize=${pageSize}&columnName=${column}&search=${search}`);
  }

  // EXPORT API
  rolesListExport(columns: ColumnDefinition[], format: string) {
    return this.http.post<any>(`${this.API_URL}/domain/roles/by-filter/export?format=${format}`, columns);
  }

  getRolesListNameSearch(page: number, pageSize: number, name: string) {
    return this.http.post<{ count: number, totalPages: number, data: Role[] }>(`${this.API_URL}/domain/roles/get/by-name-request?name=${name}&page=${page}&pageSize=${pageSize}`, name);
  }

}

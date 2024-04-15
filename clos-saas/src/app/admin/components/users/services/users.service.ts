import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ExportFile, User, UserFilter, UsersFilterSort } from '../models/User';
import { DownloadJob } from './download-data.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userDetail: any;
  API_URL: string = '';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.domain_data_service;
  }

  getUsersList(page: number, pageSize: number) {
    return this.http.get<{ count: number, totalPages: number, data: User[] }>(`${this.API_URL}/domain/users/?page=${page}&pageSize=${pageSize}`);
  }
  createUser(user: User) {
    return this.http.post<User[]>(`${this.API_URL}/domain/users/`, user);
  }
  editUser(id: number, user: User) {
    return this.http.put<User[]>(`${this.API_URL}/domain/users/${id}/update`, user);
  }
  deleteUser(id: number) {
    return this.http.delete(`${this.API_URL}/domain/users/${id}/delete`, { responseType: 'text' });
  }

  filterUserTable(page: number, pageSize: number, filterData: any, orderBy: string, order: string) {
    return this.http.post<{ count: number, totalPages: number, data: User[] }>(`${this.API_URL}/domain/users/get?page=${page}&pageSize=${pageSize}&order=${order}&orderBy=${orderBy}`, filterData);
  }

  getCounterpartyList(userName: string) {
    return this.http.get<{ count: number, totalPages: number, data: any[] }>(`${this.API_URL}/domain/users/users_counter_party?username=${userName}&page=1&pageSize=1`);
  }

  getUsersListDropdown(search: string) {
    return this.http.get<any>(`${this.API_URL}/domain/users/dropdown?page=1&pageSize=200&column=username&search=${search}`);
  }

  //Get data by passing filter object and sort array object as a paramenter
  getFiltersByMultiSort(filterByMultiSort: UsersFilterSort, page: number, pageSize: number) {
    return this.http.post<{ count: number, totalPages: number, data: User[] }>
      (`${this.API_URL}/domain/users/user/by-data-request?page=${page}&pageSize=${pageSize}`, filterByMultiSort);
  }

  //get & set user
  getUser(userInput: User) {
    this.userDetail = userInput;
  }
  setUser() {
    return this.userDetail;
  }

  getExportFile(filter: ExportFile, fileFormat: string) {
    return this.http.post<DownloadJob>(`${this.API_URL}/domain/users/export?format=${fileFormat}`, filter);
  }
  getFileByJob(id: number) {
    return this.http.get(`${this.API_URL}/downloads/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }
  getPasswordEncoder(password: string) {
    return this.http.get(`${this.API_URL}/domain/users/encrypt/password?password=${password}`);
  }
  getPasswordValidation(password:string) {
    return this.http.post<any[]>(`${this.API_URL}/domain/users/password/validation`, password);
  }

  //MANAGE USER LISTING
  
  getManageUsersList(columns: ColumnDefinition[], page: number, pageSize: number) {
    return this.http.post(`${this.API_URL}/domain/users/gets?page=${page}&pageSize=${pageSize}`, columns);
  }

  //MANAGE USER FILTER

  getDropdownList(page: number, pageSize: number, column: string, search: string) {
    return this.http.get(`${this.API_URL}/domain/users/dropdown?page=${page}&pageSize=${pageSize}&column=${column}&search=${search}`);
  }

//  SELF ASSIGN USER DROP DOWN LIST 
  getDropdownclaimList(search: string) {
    return this.http.get<any>(`${this.API_URL}/domain/users/dropdown?page=1&pageSize=200&column=username&search=${search}`);
  }

  //MANAGE USER EXPORT API 

  manageUserListExport(columns: ColumnDefinition[],format:string, pageSize: number) {
    return this.http.post<any>(`${this.API_URL}/domain/users/export/column?format=${format}&pageNum=${pageSize}`, columns);
  }

  //MANAGE USER EXPORT API GETJOB

  getJob(id: number) {
    return this.http.get<DownloadJob>(`${this.API_URL}/downloads/jobs/${id}`);
  }
}

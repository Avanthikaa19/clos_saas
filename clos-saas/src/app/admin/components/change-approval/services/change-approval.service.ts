import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ChangeApproval, ChangeApprovalFilterSort } from '../models/ChangeApproval';

@Injectable({
  providedIn: 'root'
})
export class ChangeApprovalService {
  changesApproval: any = null;

  API_URL: string = '';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.audit_data_service;
   }

  getChangeApprovalByFilter(filter: ChangeApproval, page: number, pageSize: number) {
    return this.http.post<{ count: number, totalPages: number, data: ChangeApproval[] }>
      (`${this.API_URL}/changes/by_filter?page=${page}&pageSize=${pageSize}`, filter);
  }
  updateChangeApproval(filter: ChangeApproval, id: number) {
    return this.http.post<{ headers: {}, body: ChangeApproval, statusCode: string, statusCodeValue: number }>
      (`${this.API_URL}/changes/${id}?`, filter);
  }
  //Get data by passing filter object and sort array object as a paramenter
  getFiltersByMultiSort(filterByMultiSort: ChangeApprovalFilterSort, page: number, pageSize: number) {
    return this.http.post<{ count: number, totalPages: number, data: ChangeApproval[] }>
    (`${this.API_URL}/changes/get/by-data-request?page=${page}&pageSize=${pageSize}`, filterByMultiSort);
  }
}

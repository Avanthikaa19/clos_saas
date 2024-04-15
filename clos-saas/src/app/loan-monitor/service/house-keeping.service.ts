import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { HouseKeepingJob } from '../components/house-keeping/models/houseKeeping';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';

@Injectable({
  providedIn: 'root'
})

export class HouseKeepingService {
  API_URL: string = '';

  constructor
    (
      public http: HttpClient,
      private configurationService: ConfigurationService
    ) {
    this.API_URL = this.configurationService.apiUrl().services.lo_monitor_service;
  }
  getDatabaseList() {
    return this.http.get<any[]>(`${this.API_URL}/houseKeeping/getDatabase`)
  }
  getTableNamesList(dataBase: string) {
    return this.http.get<any[]>(`${this.API_URL}/houseKeeping/retrieveTableNames?databaseName=${dataBase}`)
  }
  getAllHouseKeepingJobs(page: number, pageSize: number, column: ColumnDefinition[]) {
    return this.http.post<any>(`${this.API_URL}/houseKeeping/getData?pageNumber=${page}&pageSize=${pageSize}`, column)
  }
  createHouseKeepingJob(jobDetail: HouseKeepingJob) {
    return this.http.post<any>(`${this.API_URL}/houseKeeping/saveData`, jobDetail)
  }
  getFilterHouseKeeping(page: number, pageSize: number, column: ColumnDefinition[]) {
    return this.http.post<any>(`${this.API_URL}/houseKeeping/getData?pageNumber=${page}&pageSize=${pageSize}`, column)
  }
  getExportHouseKeeping(format: any, column: any) {
    return this.http.post<any>(`${this.API_URL}/houseKeeping/export?downloadType=${format}`, column)
  }
  getFilterDropdown(page: number, pageSize: number,column:string,search:string) {
    return this.http.get<any[]>(`${this.API_URL}/houseKeeping/dropdown?column=${column}&page=${page}&pageSize=${pageSize}&search=${search}`)
  }
  updateHouseKeepingJob(jobDetail:HouseKeepingJob){
    return this.http.put<any>(`${this.API_URL}/houseKeeping/updateData/${jobDetail.id}`,jobDetail)
   }
}

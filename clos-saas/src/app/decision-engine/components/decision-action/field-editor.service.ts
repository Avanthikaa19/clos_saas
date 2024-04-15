import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ActionFieldDetail } from '../../models/DecisionAction';

@Injectable({
  providedIn: 'root'
})
export class FieldEditorService {
  API_URL: string = '';

  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  // Add new field
  createNewField(ActionFieldDetail :ActionFieldDetail) {
    return this.http.post<ActionFieldDetail>(`${this.API_URL}createaction/`,ActionFieldDetail);
  }

  // Update Table fields 
  updateAddedFields(id:number,ActionFieldDetail :ActionFieldDetail) {
    return this.http.put<ActionFieldDetail>(`${this.API_URL}updateaction/${id}/`,ActionFieldDetail);
  }

  // Delete fields
  DeleteAddedFields(id:number){
    return this.http.delete<ActionFieldDetail>(`${this.API_URL}deleteaction/${id}/`)
  }

  // list fields data
  fieldDataList(columns: ColumnDefinition[], page: number, page_size: number) {
    return this.http.post<ColumnDefinition[]>(`${this.API_URL}/getaction/?page=${page}&page_size=${page_size}`, columns);
  }

  // Export api 
  fieldEditorExport(columns: ColumnDefinition[],pageNum:number, format_type: string) {
    return this.http.post<any>(`${this.API_URL}exportaction/?pageNum=${pageNum}&format_type=${format_type}`,columns, {responseType: 'arraybuffer' as 'json' });
  }

  // Filter dropdown 
  fieldEditorDropdown( page: number, page_size: number,column:string,search:string) {
    return this.http.get<any>(`${this.API_URL}/actiondropdown/?page=${page}&page_size=${page_size}&column=${column}&search=${search}`);
  }
}


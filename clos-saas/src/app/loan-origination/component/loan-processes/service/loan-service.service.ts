import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnList } from 'src/app/data-entry/initial-display/data-entry-home/data-entry-home.component';
import { ColumnDefinition } from 'src/app/general/components/generic-data-table/generic-data-table.component';
import { DownloadJob } from 'src/app/loan-application/common/download.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ApplicantDetail, ApplicationObject, Documentation, DocumentList, FilterSortApplicationModel, InitialDataCapture } from '../model';

@Injectable({
  providedIn: 'root'
})
export class LoanServiceService {
  API_URL: string = '';

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.loan_data_service;
  }

  getApplications(pageNo: number, pageSize: number, applicationList: FilterSortApplicationModel) {
    return this.http.post<any[]>(`${this.API_URL}/dataentry/getall-initialdata?pageNum=${pageNo}&pageSize=${pageSize}`, applicationList);
  }

  deleteApplication(appId: number) {
    return this.http.delete(`${this.API_URL}/dataentry/delete-initialdata/${appId}`, { responseType: "text" });
  }

  saveInitialDataEntry(initialData: InitialDataCapture) {
    return this.http.post<number>(`${this.API_URL}/dataentry/save-initialdata`, initialData);
  }

  updateDataEntry(appId: number, data) {
    return this.http.put<any>(`${this.API_URL}/dataentry/update-initialdata/${appId}`, data)
  }

  getApplicationDataWithId(appID: number) {
    return this.http.get<ApplicationObject>(`${this.API_URL}/dataentry/getApplicationInfo/${appID}`);
  }

  getLoanPurposeDropdown(loanType: string) {
    return this.http.get<string[]>(`${this.API_URL}/dataentry/loantype-dropdown?loanType=${loanType}`);
  }

  getDocuments(appID, page, pageSize) {
    return this.http.get<DocumentList[]>(`${this.API_URL}/dataentry/documents?id=${appID}&pageSize=${pageSize}&page=${page}`);
  }

  // Document Upload
  uploadDocument(appId: number, formData: FormData, documentId: number) {
    return this.http.post(`${this.API_URL}/dataentry/uploadFile?applicantId=${appId}&documentId=${documentId}`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  // Document Download
  downloadDocument(appId: number, documentId: number) {
    return this.http.get(`${this.API_URL}/dataentry/downloadFile?applicationid=${appId}&documentId=${documentId}`, { responseType: 'arraybuffer' })
  }

  previewDocument(appId: number, documentId: number) {
    return this.http.get(`${this.API_URL}/dataentry/previewFile?applicationid=${appId}&documentId=${documentId}`, { responseType: 'arraybuffer' })
  }

  // Document Filter
  docFilter(pageSize: number, page: number, documentList: Documentation, appId: number) {
    return this.http.get(`${this.API_URL}/dataentry/documents?pageSize=${pageSize}&page=${page}&id=${appId}`);
  }

  // Application Count
  getAppCounts(fromDate: string, toDate: string) {
    return this.http.get(`${this.API_URL}/dataentry/application-count?applicationDateFrom=${fromDate}&applicationDateTo=${toDate}`);
  }

  // SME Loan Products
  getLoanProducts(fromDate: string, toDate: string) {
    return this.http.get(`${this.API_URL}/dataentry/loantype/percentage?applicationDateFrom=${fromDate}&applicationDateTo=${toDate}`);
  }

  // Submit Application
  getSubmit(appId: number) {
    return this.http.get(`${this.API_URL}/dataentry/submit/application?applicationId=${appId}`, { responseType: 'text' })
  }

  // Bar Graph
  getBarGraph(fromDate: string, toDate: string) {
    return this.http.get(`${this.API_URL}/dataentry/bargraph/count?applicationDateFrom=${fromDate}&applicationDateTo=${toDate}`)
  }

  // Save Company Details
  saveCompanyDetails(appId: number, data) {
    return this.http.post(`${this.API_URL}/dataentry/save-companyDetails?applicationId=${appId}`, data);
  }

  // Save Applicant Details
  saveApplicantDetails(appId: number, data) {
    return this.http.post(`${this.API_URL}/dataentry/save-applicantDetails?applicationId=${appId}`, [data]);
  }

  // Save Collateral Details
  saveCollateralDetails(appId: number, data) {
    return this.http.post(`${this.API_URL}/dataentry/save-collateralOverview?applicationId=${appId}`, data)
  }

  // Create Applicant
  saveApplicant(appId: number, applicantDetail: ApplicantDetail) {
    return this.http.post<ApplicantDetail>(`${this.API_URL}/dataentry/save-applicantDetails?applicationId=${appId}`, [applicantDetail])
  }

  // Multiple Applicant
  getApplicant(appId: number) {
    return this.http.get<ApplicantDetail[]>(`${this.API_URL}/dataentry/get-applicant-detail/${appId}`)
  }

  // Delete Applicant
  deleteApplicant(appId: number) {
    return this.http.delete(`${this.API_URL}/dataentry/delete-applicant/${appId}`, { responseType: 'text' })
  }

  // Update Applicant
  updateApplicant(appId: number, applicantDetail: ApplicantDetail) {
    return this.http.put<ApplicantDetail>(`${this.API_URL}/dataentry/update-Applicant/${appId}`, applicantDetail)
  }

  // duplicate apps
  getDuplicateApp() {
    return this.http.get<any[]>(`${this.API_URL}/findDuplicates/aggregation`)
  }

  // Duplicate List
  getDuplicate(response) {
    return this.http.post(`${this.API_URL}/findDuplicates/`, response, { responseType: 'json' })
  }

  // Column definition using table lisiting API
  getList(columns: ColumnDefinition[], page: number, pageSize: number, isView: boolean) {
    return this.http.post(`${this.API_URL}/by-filter/getall/credit/applications?pageNum=${page}&pageSize=${pageSize}&isView=${isView}`, columns);
  }

  // fields names api 
  getFieldsName() {
    return this.http.get<any[]>(`${this.API_URL}/get/columns`)
  }

  //dropdown API
  getDropdownList(page: number, pageSize: number, column: string, search: string) {
    return this.http.get(`${this.API_URL}/columnvalue/dropdown?page=${page}&pageSize=${pageSize}&column=${column}&search=${search}`);
  }

  //CONFIGIURATION LISTING SCREEN EXPORT APIS
  // EXPORT API  (1) 
  duplicateListExport(columns: ColumnDefinition[], format: string, pageSize: number) {
    return this.http.post<any>(`${this.API_URL}/export/column?format=${format}&pageNum=${pageSize}`, columns);
  }
  // EXPORT GET JOB API (2)
  getJob(id: number) {
    return this.http.get<DownloadJob>(`${this.API_URL}/jobs/${id}`);
  }
  // EXPORT GET FILE API (3)
  getFileByJob(id: number) {
    return this.http.get(`${this.API_URL}/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }

  //Accept Duplicate Button Function
  acceptDuplicatenyId(status: boolean, selectedId: any[]) {
    return this.http.post<any>(`${this.API_URL}/case-management/approve?status=${status}`, selectedId);
  }

  // ZIP FILE UPLOAD API

  attachZipFile(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', `${this.API_URL}/initial-stage/upload/attachments`, formdata, {
      reportProgress: true,
      responseType: 'text'
    }
    );
    return this.http.request(req);
  }


  //SAVE API FOR DATA ENTRY

  saveDataEntry(columnList: ColumnList) {
    return this.http.post<any>(`${this.API_URL}/initial-stage/save/manual-application`, columnList);
  }

  //UPDATE API FRO DATA ENTRY 

  updateDataEntryFields(columnList: ColumnList) {
    return this.http.post<any>(`${this.API_URL}/initial-stage/newData/save`, columnList)
  }

  //get field name for application

  getFieldname() {
    return this.http.get(`${this.API_URL}/initial-stage/get/manualentry/columns`);
  }

  // fields names api 
  getDataentrydateFieldsName() {
    return this.http.get<any[]>(`${this.API_URL}/data/entry/date/field`)
  }


  // DATA ENTRY VIEW APPLICATION TABLE SCREEN APIS


  // fields names api 
  getDataentryFieldsName() {
    return this.http.get<any[]>(`${this.API_URL}/data/entry/field`)
  }

  // Column definition using table lisiting API
  getviewList(columns: ColumnDefinition[], page: number, pageSize: number) {
    return this.http.post(`${this.API_URL}/data/entry/get?page=${page}&pageSize=${pageSize}`, columns);
  }


  // //Application status  api -> OLD
  // getApplicationStatus(id: number, stage: string) {
  //   return this.http.get<any[]>(`${this.API_URL}/data/entry/status?id=${id}&stage=${stage}`)
  // }

  //Application status  api -> NEW
  getApplicationStatus(id: number, stage: string) {
    return this.http.get<any[]>(`${this.API_URL}/data/entry/result?id=${id}&stage=${stage}`)
  }

  //Application status  api 
  getApplicationStatusSearch(search: string) {
    return this.http.get<any[]>(`${this.API_URL}/data/entry/value?searchValue=${search}`)
  }

  // fields names api 
  getapplicationdateFieldsName() {
    return this.http.get<any[]>(`${this.API_URL}/data/entry/date/display`)
  }

  // Data Entry API for binding values
  getDataEntryVaueById(id: number) {
    return this.http.get(`${this.API_URL}/initial-stage/manual-application/${id}`);
  }

  //DATA ENTRY DELETE API IN EDIT MODE

  deleteUpdatedFile(id: number) {
    return this.http.get(`${this.API_URL}/initial-stage/delete/document?id=${id}`);
  }

}

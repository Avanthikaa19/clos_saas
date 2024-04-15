import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
// import { UrlService } from 'src/app/services/http/url.service';
import { ComputationQuery, ComputationStage, ExtractionQuery, Layout, Report, Theme ,ReportParamSpec, JobExecution, JobExecutionLog, ReportsFetchFilter} from '../models/Models';

@Injectable({
  providedIn: 'root'
})
export class ReportPortalDataService {
  API_URL: string = '';
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.report_data_service;
  }

  getAllThemesByPageAndName(pageSize: number, page: number, name: string) {
    return this.http.post<{totalPages: number, records: number, content: Theme[]}>(`${this.API_URL}/api/reports/themes/get_by_name?pageSize=${pageSize}&page=${page}`, name);
  }

  getTheme(id: number) {
    return this.http.get<Theme>(`${this.API_URL}/api/reports/themes/${id}`);
  }

  createTheme(theme: Theme) {
    return this.http.post<Theme>(`${this.API_URL}/api/reports/themes`, theme);
  }

  updateTheme(theme: Theme) {
    return this.http.put<Theme>(`${this.API_URL}/api/reports/themes/${theme.id}`, theme);
  }

  deleteTheme(id: number) {
    return this.http.delete(`${this.API_URL}/api/reports/themes/${id}`);
  }

  //FONTS
  getFontFamilyNames() {
    return this.http.get<string[]>(`${this.API_URL}/api/reports/fonts`);
  }

  //CELL DATA TYPE
  getCellDataTypes() {
    return this.http.get<string[]>(`${this.API_URL}/api/reports/cells/types`);
  }

  //LAYOUTS
  getAllLayoutsByPageAndName(pageSize: number, page: number, name: string) {
    return this.http.post<{totalPages: number, records: number, content: Layout[]}>(`${this.API_URL}/api/reports/layouts/get_by_name?pageSize=${pageSize}&page=${page}`, name);
  }

  getLayout(id: number) {
    return this.http.get<Layout>(`${this.API_URL}/api/reports/layouts/${id}`);
  }

  createLayout(layout: Layout) {
    return this.http.post<Layout>(`${this.API_URL}/api/reports/layouts`, layout);
  }

  updateLayout(layout: Layout) {
    return this.http.put<Layout>(`${this.API_URL}/api/reports/layouts/${layout.id}`, layout);
  }

  deleteLayout(layoutId: number) {
    return this.http.delete(`${this.API_URL}/api/reports/layouts/${layoutId}`);
  }

  //EXTRACTIONS
  getAllExtractionsByPageAndName(pageSize: number, page: number, name: string) {
    return this.http.post<{totalPages: number, records: number, content: ExtractionQuery[]}>(`${this.API_URL}/api/reports/extraction_queries/get_by_name?pageSize=${pageSize}&page=${page}`, name);
  }

  getExtraction(id: number) {
    return this.http.get<ExtractionQuery>(`${this.API_URL}/api/reports/extraction_queries/${id}`);
  }

  createExtraction(extraction: ExtractionQuery) {
    return this.http.post<ExtractionQuery>(`${this.API_URL}/api/reports/extraction_queries`, extraction);
  }

  updateExtraction(extraction: ExtractionQuery) {
    return this.http.put<ExtractionQuery>(`${this.API_URL}/api/reports/extraction_queries/${extraction.id}`, extraction);
  }

  deleteExtraction(extractionId: number) {
    return this.http.delete(`${this.API_URL}/api/reports/extraction_queries/${extractionId}`);
  }

  //COMPUTATION STAGE
  getAllComputationStagesByReportId(reportId: number) {
    return this.http.post<{totalPages: number, records: number, content: ComputationStage[]}>(`${this.API_URL}/api/reports/computation_stages/get_by_report`, reportId);
  }

  deleteComputationStage(id: number) {
    return this.http.delete(`${this.API_URL}/api/reports/computation_stages/${id}`);
  }

  //COMPUTATION QUERY
  getAllComputationsByPageAndName(pageSize: number, page: number, name: string) {
    return this.http.post<{totalPages: number, records: number, content: ComputationQuery[]}>(`${this.API_URL}/api/reports/computation_queries/get_by_name?pageSize=${pageSize}&page=${page}`, name);
  }

  getComputation(id: number) {
    return this.http.get<ComputationQuery>(`${this.API_URL}/api/reports/computation_queries/${id}`);
  }

  createComputation(extraction: ComputationQuery) {
    return this.http.post<ComputationQuery>(`${this.API_URL}/api/reports/computation_queries`, extraction);
  }

  updateComputation(extraction: ComputationQuery) {
    return this.http.put<ComputationQuery>(`${this.API_URL}/api/reports/computation_queries/${extraction.id}`, extraction);
  }

  deleteComputation(extractionId: number) {
    return this.http.delete(`${this.API_URL}/api/reports/computation_queries/${extractionId}`);
  }

  // REPORTS
  getAllReportsByPageAndName(pageSize: number, page: number, name: string) {
    return this.http.post<{totalPages: number, records: number, content: Report[]}>(`${this.API_URL}/api/reports/get_by_name?pageSize=${pageSize}&page=${page}`, name);
  }

  getAllReportsByPageAndNameAndFolders(pageSize: number, page: number, filter: ReportsFetchFilter) {
    return this.http.post<{totalPages: number, records: number, content: Report[]}>(`${this.API_URL}/api/reports/get_by_name_and_folders?pageSize=${pageSize}&page=${page}`, filter);
  }

  getReport(id: number) {
    return this.http.get<Report>(`${this.API_URL}/api/reports/${id}`);
  }

  createReport(report: Report) {
    return this.http.post<Report>(`${this.API_URL}/api/reports`, report);
  }

  updateReport(report: Report) {
    return this.http.put<Layout>(`${this.API_URL}/api/reports/${report.id}`, report);
  }

  deleteReport(report: Report) {
    return this.http.delete(`${this.API_URL}/api/reports/${report.id}`);
  }


  // REPORT GENERATION
  getFoldersByName(nameSearch: string) {
    return this.http.post<string[]>(`${this.API_URL}/api/reports/folders`, nameSearch);
  }

  fillReport(id: number, outputFormat: string, reportParamSpecs : ReportParamSpec[]) {
    return this.http.post<string[]>(`${this.API_URL}/api/reports/${id}/fill?output_format=${outputFormat}`, reportParamSpecs);
  }
  getReportFile(id:number) {
    return this.http.get(`${this.API_URL}/jobs/${id}/get-file`, { responseType: 'blob' });
  }
  

  // report generate testing  
  downloadReconReport(download){
    // let headers = new HttpHeaders();
    // headers = headers.set('Accept', 'application/json').set('Access-Control-Allow-Origin', '*');
    // return this.http.get(`${this.API_URL}/dummyDownload`,{ responseType: 'arraybuffer' as 'json', observe:'events', reportProgress: true });
      return this.http.post(`${this.API_URL}/api/bdn/recon-report/download`,download, { responseType: 'arraybuffer' as 'json', observe:'events', reportProgress: true });
  }


  // VIEW ALL JOBS
  getJobByName(pageSize: number, page: number, reportName: string){
    return this.http.post<{totalPages: number, records: number, content: JobExecution[]}>(`${this.API_URL}/api/reports/jobs/get_by_report_name?pageSize=${pageSize}&page=${page}`, reportName);
  }

  getExecutionLogs(pageSize: number, page: number, jobId: number, logTypes: string[]){
    return this.http.post<{totalPages: number, records: number, content: JobExecutionLog[]}>(`${this.API_URL}/api/reports/jobs/logs?pageSize=${pageSize}&page=${page}`, {jobId: jobId, logTypes: logTypes});
  }

}

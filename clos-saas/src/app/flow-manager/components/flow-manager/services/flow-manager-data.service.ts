import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Workflow, TaskStatusResponse, Entry, Task, Bucket, Worksheet, TaskLog, WorksheetStatus, BucketStatus, MatchStatus, TableField, Table, EntryFilter, FileBatch, AssignableClassField, TaskType, DFMFieldMapperTesterConfig, QMSStatus, DFMSystem } from '../models/models-v2';
// import { UrlService } from 'src/app/services/http/url.service';
// import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlowManagerDataService {
  ALERTS_API_URL: string = '';
  API_URL: string = '';
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.ALERTS_API_URL = this.configurationService.apiUrl().services.alerts_data_service;
    this.API_URL = this.configurationService.apiUrl().services.flow_manager_data_service;
  }

  //WORKFLOWS
  getWorkflows() {
    return this.http.get<Workflow[]>(`${this.API_URL}/api/dfm/workflows`);
  }

  createWorkflow(workflow: Workflow) {
    return this.http.post<Workflow>(`${this.API_URL}/api/dfm/workflows`, workflow);
  }

  updateWorkflow(id: number, workflow: Workflow) {
    return this.http.put<Workflow>(`${this.API_URL}/api/dfm/workflows/${id}`, workflow);
  }

  deleteWorkflow(id: number) {
    return this.http.delete(`${this.API_URL}/api/dfm/workflows/${id}`);
  }

  //WORKSHEETS

  getWorksheet(id: number) {
    return this.http.get<Worksheet>(`${this.API_URL}/api/dfm/worksheets/${id}`);
  }

  createWorksheet(worksheet: Worksheet) {
    return this.http.post<Worksheet>(`${this.API_URL}/api/dfm/worksheets`, worksheet);
  }

  updateWorksheet(id: number, worksheet: Worksheet) {
    return this.http.put<Worksheet>(`${this.API_URL}/api/dfm/worksheets/${id}`, worksheet);
  }

  deleteWorksheet(id: number) {
    return this.http.delete(`${this.API_URL}/api/dfm/worksheets/${id}`);
  }

  getWorksheetStatus(id: number) {
    return this.http.get<WorksheetStatus>(`${this.API_URL}/api/dfm/worksheets/${id}/status`);
  }

  //TASKS

  getTaskLayers() {
    return this.http.get<string[]>(`${this.API_URL}/api/dfm/tasks/layers`);
  }

  getTaskTypes() {
    return this.http.get<TaskType[]>(`${this.API_URL}/api/dfm/tasks/types`);
  }

  createTask(task: Task) {
    return this.http.post<Task>(`${this.API_URL}/api/dfm/tasks`, task);
  }

  updateTask(id: number, task: Task) {
    return this.http.put<Task>(`${this.API_URL}/api/dfm/tasks/${id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.API_URL}/api/dfm/tasks/${id}`);
  }

  getTaskById(id: number) {
    return this.http.get<Task>(`${this.API_URL}/api/dfm/tasks/${id}`);
  }

  getTaskStatus(taskId: number) {
    return this.http.get<TaskStatusResponse>(`${this.API_URL}/api/dfm/tasks/${taskId}/status`);
  }

  getTasksStatuses(taskIds: number[]) {
    return this.http.post<TaskStatusResponse[]>(`${this.API_URL}/api/dfm/tasks/status`, taskIds);
  }

  cloneTask(task: Task) {
    return this.http.post<Task>(`${this.API_URL}/api/dfm/task/clone`, task);
  }

  cloneWorksheet(worksheet: Worksheet) {
    return this.http.post<Worksheet>(`${this.API_URL}/api/dfm/worksheets/clone`, worksheet);
  }


  cloneWorflow(workflow: Workflow) {
    return this.http.post<Workflow>(`${this.API_URL}/api/dfm/workflows/clone`, workflow);
  }



  startTask(taskId: number) {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/dfm/tasks/start`, taskId);
  }

  stopTask(jobName: string) {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/dfm/tasks/stop`, jobName);
  }

  //TASK CONFIGURATIONS

  getDefaultConfiguration(taskType: string) {
    return this.http.get<any>(`${this.API_URL}/api/dfm/config/default?taskType=${taskType}`);
  }

  validateConfiguration(taskType: string, config: any) {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/dfm/task/config/validation?type=${taskType}`, config);
  }

  getConfigurationFormulas(taskType: string) {
    return this.http.get<any>(`${this.API_URL}/api/dfm/configs/formulas?taskType=${taskType}`);
  }

  getMqConnectionConfigurations() {
    return this.http.get<string[]>(`${this.API_URL}/api/dfm/connections/mq`);
  }

  getDTDConnectionConfigurations() {
    return this.http.get<string[]>(`${this.API_URL}/api/dfm/connections/dtd`);
  }

  getTableInserterTables() {
    return this.http.get<Table[]>(`${this.API_URL}/api/dfm/configs/table-inserter-tables`);
  }

  getTableInserterTableFields(table: Table) {
    return this.http.post<TableField[]>(`${this.API_URL}/api/dfm/configs/table-inserter-fields`, table);
  }

  getSCFProcessorFields() {
    return this.http.get<AssignableClassField[]>(`${this.API_URL}/api/dfm/configs/scf-processor-fields`);
  }

  getPLSSCFProcessorFields() {
    return this.http.get<AssignableClassField[]>(`${this.API_URL}/api/dfm/configs/pls-scf-processor-fields`);
  }

  getPLSFXProcessorFields() {
    return this.http.get<AssignableClassField[]>(`${this.API_URL}/api/dfm/configs/pls-fx-processor-fields`);
  }

  getPLSProcessorFields() {
    return this.http.get<AssignableClassField[]>(`${this.API_URL}/api/dfm/configs/pls-processor-fields`);
  }

  getFXProcessorFields() {
    return this.http.get<AssignableClassField[]>(`${this.API_URL}/api/dfm/configs/fx-processor-fields`);
  }

  getTradeProcessorFields() {
    return this.http.get<AssignableClassField[]>(`${this.API_URL}/api/trades/dfm/configs/trade-processor-fields`);
  }

  testFieldMapperConfig(testerConfig: DFMFieldMapperTesterConfig) {
    return this.http.post<{ isError: boolean, result: any }>(`${this.API_URL}/api/dfm/test/field-mapper`, testerConfig);
  }

  getxmlFiles() {
    return this.http.get<string[]>(`${this.API_URL}/api/dfm/configs/field-mapper/templates`);
  }
  getXmlFileFieldsData(fileName: string) {
    return this.http.post<any[]>(`${this.API_URL}/api/dfm/field_mapper/templates/fields`, fileName);
  }
  getDecisionFlowNameList() {
    return this.http.get<string[]>(`${this.ALERTS_API_URL}/alerts/decision-jobs/decision-flows`);
  }
  //TOOLS

  uploadFile(file: File, filePath: string, overwrite: boolean): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('filePath', filePath);
    formdata.append('overwrite', overwrite ? 'true' : 'false');
    const req = new HttpRequest('POST', `${this.API_URL}/api/dfm/tools/upload-file`, formdata, {
      reportProgress: true,
      responseType: 'text'
    }
    );
    return this.http.request(req);
  }

  downloadFile(taskId: number, selectedFileName: string) {
    return this.http.get(`${this.API_URL}/api/dfm/tools/download-file?taskId=${taskId}&selectedFileName=${selectedFileName}`, { responseType: 'arraybuffer' });
  }

  //ENTRIES
  getEntryById(id: number) {
    return this.http.get<Entry>(`${this.API_URL}/api/dfm/entries/${id}`);
  }

  trackEntryById(id: number) {
    return this.http.get<Entry[]>(`${this.API_URL}/api/dfm/entries/${id}/track`);
  }

  getEntriesByFilter(page: number, pageSize: number, filter: EntryFilter, sortBy: string, sortOrder: string) {
    return this.http.post<{ records: number, pages: number, data: Entry[] }>(
      `${this.API_URL}/api/dfm/entries/by_filter?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      , filter);
  }

  getEntriesByQueueAndStatus(queueId: number, queueInstance: number, processed: boolean, page: number, pageSize: number) {
    return this.http.get<{ records: number, pages: number, data: Entry[] }>
      (`${this.API_URL}/api/dfm/entries?queueId=${queueId}&queueInstance=${queueInstance}&processed=${processed ? 'Y' : 'N'}&page=${page}&pageSize=${pageSize}`);
  }

  getErrorEntriesByQueueAndStatus(queueId: number, queueInstance: number, processed: boolean, page: number, pageSize: number) {
    return this.http.get<{ records: number, pages: number, data: Entry[] }>
      (`${this.API_URL}/api/dfm/entries/errors?queueId=${queueId}&queueInstance=${queueInstance}&processed=${processed ? 'Y' : 'N'}&page=${page}&pageSize=${pageSize}`);
  }

  forceEntryErrorResolved(id: number, reason: string) {
    return this.http.post<Entry>(`${this.API_URL}/api/dfm/entries/${id}/errors/force-resolve`, reason);
  }

  forceEntryErrorResolvedByTask(taskId: number, reason: string) {
    return this.http.post<{ message: string, resolveCount: number }>(`${this.API_URL}/api/dfm/tasks/${taskId}/error-entries/force-resolve`, reason);
  }

  forceEntryErrorResendByTask(taskId: number, reason: string) {
    return this.http.post<{ message: string, resolveCount: number }>(`${this.API_URL}/api/dfm/entries/${taskId}/error-entries/resend`, reason);
  }

  resendErroredEntry(id: number, newEntryBody: string) {
    return this.http.post<Entry>(`${this.API_URL}/api/dfm/entries/${id}/errors/resend`, newEntryBody);
  }

  purgeAllProcessedEntriesByTaskId(id: number) {
    return this.http.delete<{ message: string }>(`${this.API_URL}/api/dfm/entries/purge-processed-by-task/${id}`);
  }

  purgeAllUnprocessedEntriesByTaskId(id: number) {
    return this.http.delete<{ message: string }>(`${this.API_URL}/api/dfm/entries/purge-unprocessed-by-task/${id}`);
  }

  reprocessEntries(ids: number[], batchSize: number, clearCache: boolean) {
    return this.http.post<{ message: string }>(`${this.API_URL}/api/dfm/entries/reprocess?batchSize=${batchSize}&clearCache=${clearCache}`, ids);
  }

  //AGGREGATION BUCKETS
  getBucketById(id: number) {
    return this.http.get<Bucket>(`${this.API_URL}/api/dfm/buckets/${id}`);
  }

  getBucketContributors(id: number) {
    return this.http.get<Entry[]>(`${this.API_URL}/api/dfm/buckets/${id}/contributors`);
  }

  //FILE BATCHES
  getFileBatchesByTag(tag: string) {
    return this.http.get<FileBatch[]>(`${this.API_URL}/api/dfm/file-batch/by-tag?tag=${tag}`);
  }

  getFileBatchWithStatus(id: number) {
    return this.http.get<FileBatch>(`${this.API_URL}/api/dfm/file-batch/${id}/status`);
  }

  waitForFileBatchStart(id: number, timeoutMs: number) {
    return this.http.get<{ started: boolean }>(`${this.API_URL}/api/dfm/file-batch/${id}/wait-for-start?timeoutMs=${timeoutMs}`);
  }

  getErrorEntriesByBatchIdAndProcessed(batchId: number, processed: string) {
    return this.http.get<Entry[]>(`${this.API_URL}/api/dfm/entries/errors-by-file-batch?batchId=${batchId}&processed=${processed}`);
  }

  //LOGS
  getLogsByWorksheet(worksheetId: number, top: number) {
    return this.http.get<TaskLog[]>(`${this.API_URL}/api/dfm/logs?worksheetId=${worksheetId}&top=${top}`);
  }

  downloadWorksheet(worksheetId: number) {
    return this.http.post(`${this.API_URL}/api/dfm/worksheets/${worksheetId}/download`, { responseType: 'arraybuffer' });
  }

  exportWorksheet(file: File, id: number): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', `${this.API_URL}/api/dfm/worksheets/upload?id=${id}`, formdata, {
      reportProgress: true,
      responseType: 'text'
    }
    );
    return this.http.request(req);
  }

  getBucketStatus(pageSize: number, page: number, id: number, released: string) {
    return this.http.get<{ totalPages: number, records: number, content: BucketStatus[] }>(`${this.API_URL}/api/dfm/buckets/status-by-task?pageSize=${pageSize}&page=${page}&id=${id}&released=${released}`)
  }

  getMatchStatus(taskId: number, matched: string) {
    return this.http.get<MatchStatus[]>(`${this.API_URL}/api/dfm/buckets/matchset?taskId=${taskId}&matched=${matched}`);
  }

  getEvaluate(text: string) {
    return this.http.post(`${this.API_URL}/api/dfm/js/evaluate`, text, { responseType: 'text' });
  }

  getContent(text: string) {
    return this.http.post(`${this.API_URL}/api/dfm/dtd/file-content`, text, { responseType: 'text' });
  }

  //QMS
  getQMSStatus(taskIds: number[]) {
    return this.http.post<QMSStatus>(`${this.API_URL}/api/dfm/qms/status`, taskIds);
  }

  //SYSTEMS
  getAllSystems() {
    return this.http.get<DFMSystem[]>(`${this.API_URL}/api/dfm/systems`);
  }

  getAllSystemsByPageAndName(pageSize: number, page: number, name: string) {
    return this.http.post<{ totalPages: number, records: number, content: DFMSystem[] }>(`${this.API_URL}/api/dfm/systems/get_by_name?pageSize=${pageSize}&page=${page}`, name);
  }

  getSystem(id: number) {
    return this.http.get<DFMSystem>(`${this.API_URL}/api/dfm/systems/${id}`);
  }

  createSystem(system: DFMSystem) {
    return this.http.post<DFMSystem>(`${this.API_URL}/api/dfm/systems`, system);
  }

  updateSystem(system: DFMSystem) {
    return this.http.put<DFMSystem>(`${this.API_URL}/api/dfm/systems/${system.id}`, system);
  }

  deleteSystem(id: number) {
    return this.http.delete(`${this.API_URL}/api/dfm/systems/${id}`);
  }
  getWorkflowNames() {
    return this.http.get<{workflows: string[]}>(`${this.API_URL}/api/dfm/names/workflows`);
  }
  getWorksheetNames(workflow: string) {
    return this.http.get<{worksheets: string[]}>(`${this.API_URL}/api/dfm/names/worksheets?workflow=${workflow}`);
  }
  getTaskNames(workflow: string, worksheet: string) {
    return this.http.get<{tasks: string[]}>(`${this.API_URL}/api/dfm/names/tasks?workflow=${workflow}&worksheet=${worksheet}`);
  }

  // DYNAMIC DATA INJECTOR
  getColumnValue() {
    return this.http.get<any>(`${this.API_URL}/dynamic/datainject/status/dropdown`);
  }
  getTableName(search:string){
    return this.http.get<any>(`${this.API_URL}/dynamic/datainject/dropdown/table_name?search=${search}`)
  }
}
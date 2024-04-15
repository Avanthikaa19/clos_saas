import { Injectable } from '@angular/core';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { CustomiseDashboard, GridStackElement, SearchScope } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DownloadJob } from 'src/app/data-entry/services/download-service';

@Injectable({
  providedIn: 'root'
})
export class CustomServiceService {
  gridId = '0';
  dynamicDashboardUrl:any='';
  constructor(public http: HttpClient,
    public url:UrlService,
    private configurationService: ConfigurationService,
    ) { 
    this.dynamicDashboardUrl=this.configurationService.apiUrl().services.dynamic_dashboard_service;
  }

  gridLayout(id){
    return this.http.get<any[]>(`${this.dynamicDashboardUrl}/layoutScreen/layout_using_id?id=${id}`)
  }
  getLayouts(layout: string[]){
    return this.http.post<any[]>(`${this.dynamicDashboardUrl}/layoutScreen/layouts`,layout)
  }
  getAllTableName(){
    return this.http.get<string[]>(`${this.dynamicDashboardUrl}/dynamic_dashboard/tables`)
  }

  getTableColumns(tableName:string){
    return this.http.get<string[]>(`${this.dynamicDashboardUrl}/dynamic_dashboard/columns/?table=${tableName}`)
  }

  getQueryData(chartName: string, queryText,page:number,pageSize:number){
    return this.http.post<string[]>(`${this.dynamicDashboardUrl}/dynamic_dashboard/query_result?widgetName=${chartName}&page=${page}&pageSize=${pageSize}`, queryText)
  }
  getQueryDataForChatrs(chartName: string, queryText){
    return this.http.post<string[]>(`${this.dynamicDashboardUrl}/dynamic_dashboard/query_result?widgetName=${chartName}`, queryText)
  }

  getAllUsers(){
    return this.http.get<string[]>(`${this.dynamicDashboardUrl}/dynamic_dashboard/users`)
  }

  //Widgets

  // Get All Widgets
  getWidgets(titleText: string, page: number, searchScope: number){
    return this.http.get<string[]>(`${this.dynamicDashboardUrl}/display/widgets?titleText=${titleText}&page=${page}&searchScope=${searchScope}`)
  }

  getTemplate(){
    return this.http.get<CustomiseDashboard[]>(`${this.dynamicDashboardUrl}/dynamic_dashboard/alltemplates`)
  }
  
  createTemplate(data: CustomiseDashboard){
    return this.http.post<string>(`${this.dynamicDashboardUrl}/dynamic_dashboard/template`,data)
  }

  updateTemplate(id: number, data: CustomiseDashboard){
    return this.http.put<string>(`${this.dynamicDashboardUrl}/dynamic_dashboard/template/${id}`,data)
  }

  getTypesOfTemplate(searchScope: number, page: number,name: string,order:string,orderBy:string){
    return this.http.get<CustomiseDashboard[]>(`${this.dynamicDashboardUrl}/dynamic_dashboard/dashboardName?keyword=${name}&page=${page}&pageSize=${searchScope}&order=${order}&orderBy=${orderBy}`)
  }

  getTemplateWithId(id: number){
    return this.http.get<CustomiseDashboard>(`${this.dynamicDashboardUrl}/dynamic_dashboard/get_dashboard?id=${id}`)
  }

  // MAPPINGS

   getMapping(screenName: string, userName: string,page:number,pageSize:any,search){
    return this.http.get<CustomiseDashboard>(`${this.dynamicDashboardUrl}/dynamic_dashboard/templates_by_screen?screenName=${screenName}&userName=${userName}&page=${page}&pageSize=${pageSize}&search=${search}`)
  }

  // getMappingDetails(id: number){
  //   return this.http.get<DashboardMapping>(`${this.dynamicDashboardUrl}/dynamic_dashboard/dashboard_mapping?id=${id}`)
  // }

  // createMapping(data: DashboardMapping){
  //   return this.http.post<string>(`${this.dynamicDashboardUrl}/dynamic_dashboard/dashboard_mapping/create`,data)
  // }

  // updateMapping(id: number, data: DashboardMapping){
  //   return this.http.put<string>(`${this.dynamicDashboardUrl}/dynamic_dashboard/dashboard_mapping/update?id=${id}`,data)
  // }

  getMappedDetails(user: string){
    return this.http.get<CustomiseDashboard>(`${this.dynamicDashboardUrl}/dynamic_dashboard/get_primary_dashboard?user=${user}`)
  }
  getUserWithDashboard(page: number, pageSize: number){
    return this.http.get(`${this.dynamicDashboardUrl}/dynamic_dashboard/dashboard_mapping/dashboard_by_user?page=${page}&pageSize=${pageSize}`)
  }

  //DEFAULT DASHBOARD

  getDefaultDashboard() {
    return this.http.get<CustomiseDashboard>(`${this.dynamicDashboardUrl}/dynamic_dashboard/default_dashboard`)
  }
  deleteDashboard(id: number) {
    return this.http.delete(`${this.dynamicDashboardUrl}/dynamic_dashboard/template/delete?id=${id}`)
  }

  savePageSize(searchScope: SearchScope) {
		return this.http.post<any>(`${UrlService.API_URL}/searchScope`, searchScope);
	}
  getPageSize(table: string) {
		return this.http.get<number>(`${UrlService.API_URL}/searchScope?tableName=${table}`);
	}
  //Export 
  getExportOfLayout(queryText:any,exportType:string,id:number,widgetName:string){
    return this.http.post<DownloadJob>(`${this.dynamicDashboardUrl}/dynamic_dashboard/query_result/export?widgetName=${widgetName}&exportType=${exportType}&id=${id}`,queryText)
  }
  getJob(id: string) {
    return this.http.get<DownloadJob>(`${this.dynamicDashboardUrl}/job/downloads/jobs/${id}`);
  }
  getFilebyJob(id: string) {
    return this.http.get(`${this.dynamicDashboardUrl}/job/downloads/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }

  //SCREEN

  getScreen(){
    return this.http.get(`${this.dynamicDashboardUrl}/dynamic_dashboard/mapped_screens`);
  }

  //HOME Mapping

  homeMapping(){
    return this.http.get<CustomiseDashboard>(`${this.dynamicDashboardUrl}/dynamic_dashboard/home_page_mapping`);
  }
 
  homepage(id:any){
    return this.http.get(`${this.dynamicDashboardUrl}/dynamic_dashboard/homePage/mapping/${id}`)
  }

  //Delete - Export
  getDeleteExport(id){
    return this.http.get(`${this.dynamicDashboardUrl}/export/cancel/${id}`);
  }

}

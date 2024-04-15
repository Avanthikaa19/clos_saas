import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbConnection, ObjectModel, ObjectModelDetail, ObjectModelFieldDetail, ObjectModelList } from '../models/ObjectModel';
import { QueryBuilder } from '../models/QueryBuilder';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ObjectModelService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

  getObjectModellist() {
    return this.http.get<ObjectModelList[]>(`${this.API_URL}objectslist/`)
  }

  getObjectModel(id: number) {
    return this.http.get<ObjectModel[]>(`${this.API_URL}selectedobjectslist/?pid=${id}/`)
  }

  postObjectModel( formData: FormData) {
    return this.http.post(`${this.API_URL}objectslist/`, formData, {
      reportProgress: true,
      observe: 'response'
    })
  }

  putObjectModel(id: number, paramid: number = 0, data: ObjectModelList) {
    return this.http.put(`${this.API_URL}objectdetails/${paramid}?pid=${id}/`, data)
  }

  getConvertedObjectModel(id: number) {
    return this.http.get<any>(`${this.API_URL}objectsdetail/${id}/`)
  }

  uploadObjectModel() {
    return this.http.post(`${this.API_URL}objectslists/`, {
      reportProgress: true,
      observe: 'response'
    })
  }

  deleteObjectModel(id: number){
    return this.http.delete(`${this.API_URL}objectModelShow/${id}/`)
  }

  putObject(id,objectModel: {}) {
    return this.http.put<any>(`${this.API_URL}objectModelShow/${id}/`,objectModel);
  }

  getDefaultObjectModel(){
    return this.http.get<any>(`${this.API_URL}getdefaultobjectmodel/`);
  }

  updateDefaultObjectModel(pid: number,object_id: number){
    return this.http.patch<ObjectModelDetail>(`${this.API_URL}defaultobjectmodeldetails/${object_id}/`,{'is_default':'True'});
  }

  getChildObjectModel(id: number){
    return this.http.get<any>(`${this.API_URL}objectsSchemalist/?parentid=${id}`);
  }

  updateChildObjectModel(id: number, editedValues: any){
    return this.http.put<any>(`${this.API_URL}objectsSchemadetail/${id}/`,editedValues);
  }

  saveDefaultObjectModel(id: number,object_id: any){
    return this.http.patch<ObjectModelDetail>(`${this.API_URL}projectdetails/${id}/`,object_id);
  }

  // updateDefaultObjectModel(id: number,object_id: number){
  //   return this.http.patch<ObjectModelDetail>(${UrlService.API_URL}defaultobjectmodeldetails/${object_id}/?pid=${id},{'is_default':'True'});
  // }

  getDBModellist(id: number) {
    return this.http.get<ObjectModelList[]>(`${this.API_URL}dblist/?pid=${id}`)
  }

  getDBModel(id: number) {
    return this.http.get<ObjectModel[]>(`${this.API_URL}selectedobjectslist/?pid=${id}/`)
  }

  postDBModel(id: number, formData: FormData) {
    return this.http.post(`${this.API_URL}dblist/`, formData, {
      reportProgress: true,
      observe: 'response'
    })
  }


  //Database Connection
  getDatabaseModelList(){
    return this.http.get<ObjectModelList[]>(`${this.API_URL}dblist/`);
  }
  createDatabaseModel(dbDetail: DbConnection){
    return this.http.post<ObjectModelList[]>(`${this.API_URL}dblist/`,dbDetail);
  }
  queryExecution(db_query: any){
    return this.http.post<any>(`${this.API_URL}queryExecution/`,db_query);
  }
  queryExecutionView(db_query: QueryBuilder){
    return this.http.post<any>(`${this.API_URL}queryExecutionView/`,db_query);
  }

  profileExecution(db_query: QueryBuilder){
    return this.http.post<any>(`${this.API_URL}profileExecution/`,db_query);
  }

  saveObjectModel(object_id: number){
    return this.http.post(`${this.API_URL}defaultobjectmodelupdate/`,{'id':object_id,'is_default':'True'})
  }
}

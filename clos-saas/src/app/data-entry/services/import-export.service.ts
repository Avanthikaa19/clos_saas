import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "src/app/services/configuration.service";
import { DirectoryModel, FileModel } from "../models/models";

@Injectable({
    providedIn: 'root'
  })
  export class ImportExportService {
  
    API_URL: string = '';
    constructor(
      private http: HttpClient,
      private configurationService: ConfigurationService
    ) {
        this.API_URL = this.configurationService.apiUrl().services.lo_monitor_service;
     }

    //To get a list of file/directories in the chosen folder
    getDirectory(path: string) {
        return this.http.post<DirectoryModel>(`${this.API_URL}/external-batch/directory-list`,path);
    }

    //To upload any file in the current folder.
    uploadFile(targetPath: string,formData: FormData) {
      return this.http.post(`${this.API_URL}/external-batch/import?targetPath=${targetPath}`, formData, {
        reportProgress: true,
        observe: 'events'
      })
    }

    //To archive and download the chosen folder
    downloadZip(file:string,sourceFolderPath: string) {
      return this.http.get(`${this.API_URL}/external-batch/zip/${file}?sourceFolderPath=${sourceFolderPath}`,{
        responseType:'arraybuffer'
      })
    }

    //To download any file present in the current folder.
    downloadFile(fileModel: FileModel) {
      return this.http.post(`${this.API_URL}/external-batch/export`,fileModel,{
        responseType:'arraybuffer'
      })
    }
 }  
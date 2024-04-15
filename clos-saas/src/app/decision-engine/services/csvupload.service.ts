import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
@Injectable({
  providedIn: 'root'
})
export class CsvuploadService {
  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }
  


  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("path", file);
    formData.append("name", file.name);


    console.log("filename" + file.name);
    console.log("File path", +file)
    // console.log(formData.get("file"))
    return this.http.post(`${this.API_URL}csvlist/`, formData, {
      reportProgress: true,
      observe: 'response'
    })
  }

  get(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file_path_csv", file);
    formData.append("file_name", file.name);


    console.log("filename" + file.name);
    console.log("File path", +file)
    // console.log(formData.get("file"))
    return this.http.post(`${this.API_URL}csvlist/`, formData, {
      reportProgress: true,
      observe: 'response'
    })
  }

}
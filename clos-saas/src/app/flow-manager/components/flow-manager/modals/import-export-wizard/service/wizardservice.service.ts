import { Injectable } from '@angular/core';
// import { UrlService } from 'src/app/services/http/url.service';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class WizardserviceService {
  API_URL: string = '';
  constructor(
    public http: HttpClient,
    private configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.flow_manager_data_service;
  }

  getExportFiles(worksheetId: string[] ){
    return this.http.post<string[]>(`${this.API_URL}/api/dfm/workflows/export`,worksheetId);
  }
 //import & Export
 importFile(file: File): Observable<HttpEvent<{}>> {
  const formdata: FormData = new FormData();
  formdata.append('file', file);
  const req = new HttpRequest('POST', `${this.API_URL}/api/dfm/workflows/import`, formdata, {
    reportProgress: true,
    responseType: 'text'
  }
  );
  return this.http.request(req);
}

objectTypeSearch(keyword:string){
  return this.http.get(`${this.API_URL}/search?keyword=${keyword}`);
}

 //get multi row submit 
getMultirowDbdetails(id:any,stageName:string){
  return this.http.get(`${this.API_URL}/get/Kyc/Preview?id=${id}&status=${stageName}`);
}

//http://localhost:9093/get/Kyc/Preview/Stage2?id=35&status=
getExternalKYCDetails(id:any,stageName:string){
  return this.http.get(`${this.API_URL}/get/Kyc/Preview/Stage2?id=${id}&status=${stageName}`);
}
}

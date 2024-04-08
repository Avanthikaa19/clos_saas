import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UrlService } from "./url-service";

@Injectable({
    providedIn: 'root'
  })

export class SaasService{
    QUERY_BUILDER_API_URL:any='';
    constructor(public http:HttpClient,public configurationService:UrlService,){
        this.QUERY_BUILDER_API_URL = this.configurationService?.apiUrl()?.services?.saas_service;
    }

//SIGN-UP
getUserSignUp(id,orgName,domain,userName,password,emailId,phoneNo){
    return this.http.post(`${this.QUERY_BUILDER_API_URL}/create_organization`,{id,orgName,domain,userName,password,emailId,phoneNo});
}
//CREATE-SEPERATE-DB
getDataBaseForOrg(id){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/create/database?id=${id}`);
}
//UPLOAD-DOCS
getUploadedDocuments(id: string, files: File[]) {
    const formData = new FormData();
    
    // Append each file to the FormData object
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    // Make a POST request to your server endpoint with the FormData object
    return this.http.post<any>(`${this.QUERY_BUILDER_API_URL}/upload/doc?id=1`, formData);
  }
}
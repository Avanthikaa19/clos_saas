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
getUserSignUp(id,orgName,domainName,userName,password){
    return this.http.post(`${this.QUERY_BUILDER_API_URL}/create_organization`,{id,orgName,domainName,userName,password});
}
//CREATE-SEPERATE-DB
getDataBaseForOrg(id){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/create/database?id=${id}`);
}
}
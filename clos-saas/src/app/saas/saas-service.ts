import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../services/configuration.service";
@Injectable({
    providedIn: 'root'
  })

export class SaasService{
    QUERY_BUILDER_API_URL:any='';
    constructor(public http:HttpClient,public configurationService:ConfigurationService,){
        this.QUERY_BUILDER_API_URL = this.configurationService.apiUrl()?.services?.saas_service;
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
    return this.http.post<any>(`${this.QUERY_BUILDER_API_URL}/upload/doc?id=${id}`, formData);
  }
  //VALIDATE ORG NAME AND DOMAIN NAME
  getValidatedOrgAndDomain(column,value){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/check/is_valid?column=${column}&value=${value}`);
  }
  //GET-FREE-TRIAL
  getFreeTrial(id,paymentStatus,approval){
    return this.http.put(`${this.QUERY_BUILDER_API_URL}/add/subscription-details?id=${id}`, {paymentStatus,approval});
  }
  //PAYMENT-TRIAL
  getPaymentTrial(userId,id,orgName,domain,userName,password,emailId,phoneNo,paymentCycle,amountPaid,subscribed,lastPaymentDate,dueAmount,upcomingDueDate,subscriptionPlan,subscribedDate,unsubscribedDate,paymentStatus,approval,currency,country,addressLine1,addressLine2,postalCode,city,state){
    return this.http.put(`${this.QUERY_BUILDER_API_URL}/add/subscription-details?id=${userId}`, {
    id,orgName,domain,userName,password,emailId,phoneNo,paymentCycle,amountPaid,subscribed,lastPaymentDate,dueAmount,upcomingDueDate,subscriptionPlan,subscribedDate,unsubscribedDate,paymentStatus,approval,currency,country,addressLine1,addressLine2,postalCode,city,state}
    );
  }
  //EMAIL-API-INTEGRATION
  sendEmailToClient(to,body){
    return this.http.post<any>(`${this.QUERY_BUILDER_API_URL}/welcome/mail`, {to,body});
  }
}
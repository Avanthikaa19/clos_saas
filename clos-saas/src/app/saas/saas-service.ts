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
getUploadedDocuments(id: string, files: File[], description: string) {
  const formData = new FormData();
  
  // Append each file to the FormData object
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i], files[i].name);
  }

  // Append the description to the FormData object
  formData.append('description', description);

  // Make a POST request to your server endpoint with the FormData object
  return this.http.post<any>(`${this.QUERY_BUILDER_API_URL}/upload/docs?id=${id}`, formData);
}
  //VALIDATE ORG NAME AND DOMAIN NAME
  getValidatedOrgAndDomain(column,value){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/check/is_valid?column=${column}&value=${value}`);
  }
  //GET-FREE-TRIAL
  getFreeTrial(id,paymentStatus,approval,trialExpiryDate){
    return this.http.put(`${this.QUERY_BUILDER_API_URL}/add/subscription-details?id=${id}`, {paymentStatus,approval,trialExpiryDate});
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
  //GET-DEMO-VIDEO-NAMES
  getWatchedDemoVideo(demo){
    return this.http.post<any>(`${this.QUERY_BUILDER_API_URL}/save/demo/watchers`, demo);
  }
  //UPLOAD INVOICE
  uploadInvoiceOfPayment(id: number, file: Blob) {
    // Create a new FormData object
    const formData = new FormData();
    // Append the blob directly to the FormData object
    formData.append('file', file, 'payment.pdf');
    // Make the HTTP POST request
    return this.http.post<any>(`${this.QUERY_BUILDER_API_URL}/save/invoice?id=${id}`, formData);
  }
  //DOWNLOAD INVOICE
  downloadInvoice(id){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/download/pdf/${id}`,{responseType:'arraybuffer'});
  }
  //GET-ALL-SUBSCRIPTION-DETAILS
  getAllSubscriptionDetails(page,pageSize){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/subscriptions/billings?page=${page}&pageSize=${pageSize}`);
  }
  //VALIDATE BY EMAIL
  validateEmailOfUsers(email){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/check/email/is_valid?email=${email}`);
  }
  //GET-DETAILS-BY-ID
  getDetailsById(id){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/organization_details/id?id=${id}`);
  }
  //GET-DOCUMENTS-BASED-ON-COUNTRY
  getDocumentsBasedOnCountry(country){
    return this.http.get(`${this.QUERY_BUILDER_API_URL}/country/doc/names?country=${country}`);
  }
}
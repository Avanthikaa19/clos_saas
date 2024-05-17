import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../services/configuration.service";
@Injectable({
    providedIn: 'root'
  })

export class SaasService{
    SAAS_API_URL:any='';
    constructor(public http:HttpClient,public configurationService:ConfigurationService,){
        this.SAAS_API_URL = this.configurationService.apiUrl()?.services?.saas_service;
    }

//SIGN-UP
getUserSignUp(id,orgName,domain,userName,password,emailId,phoneNo){
    return this.http.post(`${this.SAAS_API_URL}/create_organization`,{id,orgName,domain,userName,password,emailId,phoneNo});
}
//CREATE-SEPERATE-DB
getDataBaseForOrg(id){
    return this.http.get(`${this.SAAS_API_URL}/create/database?id=${id}`);
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
  return this.http.post<any>(`${this.SAAS_API_URL}/upload/docs?id=${id}`, formData);
}
  //VALIDATE ORG NAME AND DOMAIN NAME
  getValidatedOrgAndDomain(column,value){
    return this.http.get(`${this.SAAS_API_URL}/check/is_valid?column=${column}&value=${value}`);
  }
  //GET-FREE-TRIAL
  getFreeTrial(id,paymentStatus,approval,trialExpiryDate,maxUsers){
    return this.http.put(`${this.SAAS_API_URL}/add/subscription-details?id=${id}`, {paymentStatus,approval,trialExpiryDate,maxUsers});
  }
  //PAYMENT-TRIAL
  getPaymentTrial(userId,id,orgName,domain,userName,password,emailId,phoneNo,paymentCycle,amountPaid,subscribed,lastPaymentDate,dueAmount,upcomingDueDate,subscriptionPlan,subscribedDate,unsubscribedDate,paymentStatus,approval,currency,country,addressLine1,addressLine2,postalCode,city,state,maxUsers){
    return this.http.put(`${this.SAAS_API_URL}/add/subscription-details?id=${userId}`, {
    id,orgName,domain,userName,password,emailId,phoneNo,paymentCycle,amountPaid,subscribed,lastPaymentDate,dueAmount,upcomingDueDate,subscriptionPlan,subscribedDate,unsubscribedDate,paymentStatus,approval,currency,country,addressLine1,addressLine2,postalCode,city,state,maxUsers}
    );
  }
  //EMAIL-API-INTEGRATION
  sendEmailToClient(to,body){
    return this.http.post<any>(`${this.SAAS_API_URL}/welcome/mail`, {to,body});
  }
  //GET-DEMO-VIDEO-NAMES
  getWatchedDemoVideo(demo){
    return this.http.post<any>(`${this.SAAS_API_URL}/save/demo/watchers`, demo);
  }
  //UPLOAD INVOICE
  uploadInvoiceOfPayment(id: number, file: Blob,subscriptionPlan) {
    // Create a new FormData object
    const formData = new FormData();
    // Append the blob directly to the FormData object
    formData.append('file', file, 'payment.pdf');
    // Make the HTTP POST request
    return this.http.post<any>(`${this.SAAS_API_URL}/save/invoice?id=${id}&subscriptionPlan=${subscriptionPlan}`, formData);
  }
  //DOWNLOAD INVOICE
  downloadInvoice(id){
    return this.http.get(`${this.SAAS_API_URL}/download/pdf/${id}`,{responseType:'arraybuffer'});
  }
  //GET-ALL-SUBSCRIPTION-DETAILS
  getAllSubscriptionDetails(page,pageSize){
    return this.http.get(`${this.SAAS_API_URL}/subscriptions/billings?page=${page}&pageSize=${pageSize}`);
  }
  //VALIDATE BY EMAIL
  validateEmailOfUsers(email){
    return this.http.get(`${this.SAAS_API_URL}/check/email/is_valid?email=${email}`);
  }
  //GET-DETAILS-BY-ID
  getDetailsById(id){
    return this.http.get(`${this.SAAS_API_URL}/organization_details/id?id=${id}`);
  }
  //GET-DOCUMENTS-BASED-ON-COUNTRY
  getDocumentsBasedOnCountry(country){
    return this.http.get(`${this.SAAS_API_URL}/country/doc/names?country=${country}`);
  }
  //GET-COUNTRIES-LIST
  getListOfCountries(){
    return this.http.get(`${this.SAAS_API_URL}/country/dropdown`);
  }
  //EMAIL-OTP
  getOTPForEmail(email){
    return this.http.post<any>(`${this.SAAS_API_URL}/otp/mail?email=${email}`, email);
  }
  //VALIDATE OTP FOR MAIL
  validateOTPForEmail(email,otp){
    return this.http.post<any>(`${this.SAAS_API_URL}/validate/otp`, {email,otp});
  }
  //GET CONTACT INFO
  getContactInfo(){
    return this.http.get(`${this.SAAS_API_URL}/get/support/data`);
  }
  //GET-ALL-THE-MAPPED-PRICING-LISTS
  getPricingList(page,pageSize,order,orderBy){
    return this.http.get(`${this.SAAS_API_URL}/get/subscriptions?page=${page}&pageSize=${pageSize}&order=${order}&orderBy=${orderBy}`);
  }
  //SUBSCRIPTION-DETAILS-API
  getSubscription(amountPaid,totalUsers,subscriptionPlan,subscriptionId,paymentCycle,paidBy){
    return this.http.post<any>(`${this.SAAS_API_URL}/save/invoice/details?id=${subscriptionId}`, {amountPaid,totalUsers,subscriptionPlan,paymentCycle,paidBy});
  }
  //GET-ACCESS-BASED-ON-DOMAINNAME
  getAccessBasedOnDomainName(domain){
    return this.http.post<any>(`${this.SAAS_API_URL}/get/access`, domain);
  }
  //GET-SUBSCRIPTIONS-BY-ID
  getSubscriptionsById(id){
    return this.http.get(`${this.SAAS_API_URL}/get/invoice?id=${id}`);
  }
  //GET-PAYMENT-DETAILS
  getPaymentDetails(){
    return this.http.get(`${this.SAAS_API_URL}/get/organization/details`);
  }
  //GET-EXISTING-INVOICE-DETAILS-BY-ID
  getInvoiceDetailsById(id){
    return this.http.get(`${this.SAAS_API_URL}/get/unpaid/invoice?id=${id}`);
  }
  //GET-EXISTING-INVOICE-BY-DOMAIN-NAME
  getInvoiceDetailsByDomain(){
    return this.http.get(`${this.SAAS_API_URL}/get/user/unpaid/invoice`);
  }
  //UPDATE-INVOICE
  updateInvoiceOfPayment(id: number, file: Blob) {
    // Create a new FormData object
    const formData = new FormData();
    // Append the blob directly to the FormData object
    formData.append('file', file, 'payment.pdf');
    // Make the HTTP POST request
    return this.http.put<any>(`${this.SAAS_API_URL}/update/invoice?id=${id}`, formData);
  }
  //GET-BANK-DETAILS
  getBankDetails(){
    return this.http.get(`${this.SAAS_API_URL}/get/bank/details`);
  }
}
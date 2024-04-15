import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DownloadJob } from 'src/app/data-entry/services/download-service';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';
import { ApplicantDetail } from 'src/app/loan-origination/component/loan-processes/model';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ApplicationDetails, MultipleDetails, Statement, DynamicUploads, ProxyOverallDetails, RolloverDetails, ExtensionOfLoanDetails, ProxyDetail, ProxyFinancialInformation } from '../models/clos';
import { AttachmentDetails, ColumnDefinition } from '../models/clos-table';

@Injectable({
  providedIn: 'root'
})
export class CLosService {
  userCustomFieldsData: any;
  generatedId: number | null = null;
  API_URL: string = '';
  ATTACHMENT_API_URL: string = '';
  private fsIds: number;
  private action: string;
  private loanTypeSubject = new BehaviorSubject<string>('');
  loanType$ = this.loanTypeSubject.asObservable();

  setLoanType(loanType: string): void {
    this.loanTypeSubject.next(loanType);
  }

  getLoanType(): Observable<string> {
    return this.loanType$;
  }
  private selectedLoanTypeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedLoanType$: Observable<string> = this.selectedLoanTypeSubject.asObservable();

  setSelectedLoanType(loanType: string): void {
    this.selectedLoanTypeSubject.next(loanType);
  }
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.clos_data_service;
    this.ATTACHMENT_API_URL = this.configurationService.apiUrl().services.attachment_data_service;
  }
  private isTabEnabledSubject = new BehaviorSubject<boolean>(false);

  setTabState(enabled: boolean): void {
    this.isTabEnabledSubject.next(enabled);
  }

  getTabState(): Observable<boolean> {
    return this.isTabEnabledSubject.asObservable();
  }
  // second
  private enableSecondTabSubject = new BehaviorSubject<boolean>(false);
  enableSecondTab$ = this.enableSecondTabSubject.asObservable();
  setEnableSecondTab(enabled: boolean) {
    this.enableSecondTabSubject.next(enabled);
  }
   // Third
   private enableThirdTabSubject = new BehaviorSubject<boolean>(false);
   enableThirdTab$ = this.enableThirdTabSubject.asObservable();
   setEnableThirdTab(enabled: boolean) {
     this.enableThirdTabSubject.next(enabled);
   }
    // Fourth tab
    private enableFourthTabSubject = new BehaviorSubject<boolean>(false);
    enableFourthTab$ = this.enableFourthTabSubject.asObservable();
    setEnableFourthTab(enabled: boolean) {
      this.enableFourthTabSubject.next(enabled);
    }
    // Fifth tab
    private enableFifthTabSubject = new BehaviorSubject<boolean>(false);
    enableFifthTab$ = this.enableFourthTabSubject.asObservable();
    setEnableFifthTab(enabled: boolean) {
      this.enableFourthTabSubject.next(enabled);
    }
    // Sixth tab
    private enableSixthTabSubject = new BehaviorSubject<boolean>(false);
    enableSixthTab$ = this.enableFourthTabSubject.asObservable();
    setEnableSixthTab(enabled: boolean) {
      this.enableFourthTabSubject.next(enabled);
    }     
    // Seventh tab
    private enableSeventhTabSubject = new BehaviorSubject<boolean>(false);
    enableSeventhTab$ = this.enableFourthTabSubject.asObservable();
    setEnableSeventhTab(enabled: boolean) {
      this.enableFourthTabSubject.next(enabled);
    }  
  private activeSubTabNameSubject = new BehaviorSubject<string>('Business and operation Information');
  activeSubTabName$: Observable<string> = this.activeSubTabNameSubject.asObservable();
  private activeProxySubTabNameSubject = new BehaviorSubject<string>('Company Information');
  activeProxySubTabName$: Observable<string> = this.activeProxySubTabNameSubject.asObservable();

  setActiveSubTabName(name: string) {
    this.activeSubTabNameSubject.next(name);
  }
  setProxyActiveSubTabName(name: string) {
    this.activeProxySubTabNameSubject.next(name);
  }
  // Column definition using table lisiting API
  getApplicationList(columns: ColumnDefinition[], page: number, pageSize: number, isView: boolean,status:string) {
    return this.http.post(`${this.API_URL}/applicant-details/get/columnDefinitions?pageNumber=${page}&pageSize=${pageSize}&isView=${isView}&status=${status}`, columns);
  }
  // TO get the application Feild List
  getApplicationFeildList() {
    return this.http.get(`${this.API_URL}/applicant-details/field`);
  }
  // To Save Application Details
  saveApplication(applicationDetails: ApplicationDetails) {
    return this.http.post<any>(`${this.API_URL}/applicant-details/save`, applicationDetails);
  }
  // To Update Application Details
  updateApplicantDetails(id:number,applicationDetails: ApplicationDetails) {
    return this.http.put(`${this.API_URL}/applicant-details/update/${id}`, applicationDetails);
  }

  getApplicationDetailsByID(id:number){
    return this.http.get<any>(`${this.API_URL}/applicant-details/getData?id=${id}`);
  }
  // To Delete Application Details
  deleteApplication(appId: number) {
    return this.http.delete(`${this.API_URL}/applicant-details/deletedata/${appId}`)
  }
  // To Update Application Details
  updateApplication(appId: number, applicationDetails: ApplicationDetails) {
    return this.http.put(`${this.API_URL}/applicant-details/updateData${appId}`, applicationDetails)
  }
  //To Filter Application list dropdown API
  getDropdownList(page: number, pageSize: number, column: string, search: string) {
    return this.http.get(`${this.API_URL}/applicant-details/get/dropdown-values?pageNumber=${page}&pageSize=${pageSize}&columnName=${column}&search=${search}`);
  }
  //view data entry details 
  getCategoryList(id:number) {
    return this.http.get(`${this.API_URL}/applicant-details/category/name/?applicationId=${id}`);
  }
  getFieldList(id: string, category: string) {
    return this.http.get(`${this.API_URL}/applicant-details/get/${id}?category=${category}`);
  }
  // Get Document Details for particular Application
  getDocumentDetails(id: string) {
    return this.http.get(`${this.API_URL}/applicant-details/document/details?id=${id}`);
  }
  // Document Preview
  getDocPreview(id: number) {
    return this.http.get(`${this.ATTACHMENT_API_URL}/attachments/${id}/download`, { responseType: 'arraybuffer' });
  }
  //Application status  api -> NEW
  getApplicationStatus(id: number, stage: string) {
    return this.http.get<any[]>(`${this.API_URL}/applicant-details/result?id=${id}&stage=${stage}`)
  }

  uploadAttachment(file: File) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.post<{attachmentName: string, attachmentId: number}>(`${this.ATTACHMENT_API_URL}/attachments/upload/attachment`, formdata);}

  getAttachmentDownload(id: number) {
    return this.http.get(`${this.ATTACHMENT_API_URL}/attachments/${id}/download`, { responseType: 'blob' });
  }
  getAttachmentDetails(ids: number[]) {
    return this.http.post<AttachmentDetails[]>(`${this.ATTACHMENT_API_URL}/attachments/details`, ids);
  }
  
  // upload(upload: Uploads) {
  //   return this.http.post<any>(`${this.API_URL}/applicant-details/uploads`, upload);
  // }

  //LISTING SCREEN EXPORT API'S
  getApplicationExport(columns: ColumnDefinition[], format: string) {
    return this.http.post<any>(`${this.API_URL}/applicant-details/export?format=${format}`, columns);
  }
  // EXPORT GET JOB API (2)
  getJob(id: number) {
    return this.http.get<DownloadJob>(`${this.API_URL}/applicant-details/jobs/${id}`);
  }
  // EXPORT GET FILE API (3)
  getFileByJob(id: number) {
    return this.http.get(`${this.API_URL}/applicant-details/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }

  getFinancialInformation(){
    return this.http.get<any>(`${this.API_URL}/applicant-details/read`);
  }
  
  getUploadFile(file: File){
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.post<any>(`${this.API_URL}/upload/financial-info`,formdata );
  }
  saveMultipleDetails(details){
    return this.http.post(`${this.API_URL}/applicant-details/save/multiple-details`, details);
  }
  getMultipleDetails(id:number){
    return this.http.get<any>(`${this.API_URL}/applicant-details/get/multiple-details/${id}`); 
  }

  // get & set ApplicationDetails
  applicationDetailData:any;
  getUploadApplicationDetailData(template: ApplicationDetails) {
    this.applicationDetailData = template;
  }
  setUploadApplicationDetailData(): ApplicationDetails {
    return this.applicationDetailData;
  }
  // custom udf fields
  saveCustomFields(UserDefinedCustomFields: UserDefinedCustomFields[]){
    return this.http.post(`${this.API_URL}/applicant-details/save/app-custom-fields`, UserDefinedCustomFields);
  }
  // get udf fields
  getCustomFields(appId: number, tab: string, subTab: string){
    return this.http.get(`${this.API_URL}/applicant-details/get/app-custom-fields?appId=${appId}&tab=${tab}&subTab=${subTab}`);
  }
  // save statement fields
  statement(statement: Statement[]){
    return this.http.post(`${this.API_URL}/finance-record/save/financeData`,statement)
  }
  // get statement fields
  getstatement(appId: number,page: number,pageSize: number){
    return this.http.get(`${this.API_URL}/finance-record/get-all/byApplicationId?id=${appId}&page=${page}&pageSize=${pageSize}`)
  }
  getUploadsByLoanType(loanType: string){
    return this.http.get<any>(`${this.API_URL}/loan-config/documents?loanType=${loanType}`);
  }
  saveDynamicUploads(uploads:DynamicUploads[]){
    return this.http.post(`${this.API_URL}/applicant-details/dynamic/uploads`,uploads)
  }
  getDynamicUploads(id:number){
    return this.http.get<any>(`${this.API_URL}/applicant-details/dynamic/uploads/get?id=${id}`)
  }
  getCollateralCategories(loanType:string,collateralCategory:string){
    return this.http.get<any>(`${this.API_URL}/collateral/by-loan-type?loanType=${loanType}&collateralCategory=${collateralCategory}`)
  }
  // get API Status of Application -- IF Rollover
  getRolloverStatus(id: number, action: string,remarks:string){
    return this.http.get<any>(`${this.API_URL}/case-manager/change?id=${id}&action=${action}&remarks=${remarks}`)
  }  
  // Post API Rollover Details 
  saverollOverDetails(rollover_details: RolloverDetails){
    return this.http.post<any>(`${this.API_URL}/rollOver/save`,rollover_details)
  }
  // Get API Rollover Details 
  getrollOverDetails(appId:number,page: number,pageSize: number){
    return this.http.get<any>(`${this.API_URL}/rollOver/get-all/byApplicationId?id=${appId}&page=${page}&pageSize=${pageSize}`)
  }
  getRatioByLoan(loanType:string){
    return this.http.get<any>(`${this.API_URL}/loan-config/loan/ratio?loanType=${loanType}`)
  }
  // Save Proxy Company Information 
  saveProxyCompanyDetails(proxyCompanyDetails:ProxyDetail){
    return this.http.post(`${this.API_URL}/proxy/saveProxyCompanyInformationList`,proxyCompanyDetails)
  }
  // Save Proxy Financial Information  http://localhost:8901/proxy/saveProxyFinancialInformationList
  saveProxyFinancialDetails(proxyFinancialDetails:ProxyFinancialInformation[]){
    return this.http.post(`${this.API_URL}/proxy/saveProxyFinancialInformationList`,proxyFinancialDetails)
  }
  // Get Proxy Company Information http://localhost:8901/proxy/byApplicationId?id=123
  getProxyCompanyDetails(appId: number,page: number,pageSize: number){
    return this.http.get(`${this.API_URL}/proxy/byApplicationId?id=${appId}`)
  }
  // Get Proxy Financial Information http://localhost:8901/proxy/proxyFinance/get?id=90
  getProxyFinancialDetails(appId: number,page: number,pageSize: number){
    return this.http.get(`${this.API_URL}/proxy/proxyFinance/get?id=${appId}`)
  }
   // get API Status of Application -- IF Extension of loan 
  getExtensionofloanStatus(id: number, action: string,remarks:string){
    return this.http.get<any>(`${this.API_URL}/case-manager/change?id=${id}&action=${action}&remarks=${remarks}`)
  }  
  // Post API Extension of loan Details
  saveextensionOfLoanDetails(extensionofloan_details: ExtensionOfLoanDetails){
    return this.http.post<any>(`${this.API_URL}/extension-of-loan/save`,extensionofloan_details)
  }
  // Get API Extension of loan Details  
  getextensionOfLoanDetails(appId:number,page: number,pageSize: number){
    return this.http.get<any>(`${this.API_URL}/extension-of-loan/get-all/byAapplicationId?id=${appId}&page=${page}&pageSize=${pageSize}`)
  }
  setFsIds(fsIds: number,action: string) {
    this.fsIds = fsIds;
    this.action = action
  }

  getFsIds() {
    return this.fsIds;
  }
  getAction(){
    return this.action;
  }
  getAdditionalLoan(appId:number){
  return this.http.get<any>(`${this.API_URL}/applicant-details/getById?id=${appId}`)
  }
  resetFsIds(){
    this.fsIds = null;
  }
  resetAction(){
    this.action = null;
  }
  //Ownership and Suppliers Get API On Additional Loan call
  getOwnershipandSuppliersforAdditionalLoan(appId:number){
    return this.http.get<any>(`${this.API_URL}/applicant-details/get/multiple/${appId}`)
  }
}

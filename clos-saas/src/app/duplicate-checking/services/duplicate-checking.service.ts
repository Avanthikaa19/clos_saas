import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DownloadJob } from "src/app/admin/components/users/services/download-data.service";
import { CurrencyConfiguration } from "src/app/loan-application/components/currency-config/create-currency-config/create-currency-config.component";
import { CollateralField, loanTypeConfig, UserDefinedFields } from "src/app/loan-application/components/models/config.models";
import { ConfigurationService } from "src/app/services/configuration.service";
import { config, configurations, displayFields, DuplicateModel } from "../models/models";
import { I } from "@angular/cdk/keycodes";

@Injectable({
  providedIn: 'root'
})
export class DuplicateCheckingService {

  API_URL: string = '';
  ActivaRule: boolean = false;
  currencyData:CurrencyConfiguration = new CurrencyConfiguration();
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.API_URL = this.configurationService.apiUrl().services.clos_data_service;
  }

  private selectedCountrySubject = new BehaviorSubject<string>('');
  selectedCountry$ = this.selectedCountrySubject.asObservable();
  private selectedCurrencySubject = new BehaviorSubject<string>('');
  selectedCurrency$ = this.selectedCurrencySubject.asObservable();

  setCountryAndCurrency(country: string, currency: string) {
    this.selectedCountrySubject.next(country);
    this.selectedCurrencySubject.next(currency);
  } 
   
  // Get All Applications
  getAllApps(pageNum: number, pageSize: number, displayFields: displayFields) {
    return this.http.post(`${this.API_URL}/by-filter/getall/credit/applications?pageNum=${pageNum}&pageSize=${pageSize}`, [displayFields]);
  }

  // Get Document Details for particular Application
  getDocumentDetails(id: string) {
    return this.http.get(`${this.API_URL}/document/details?id=${id}`);
  }

  // Document Preview
  getDocPreview(id: number) {
    return this.http.get(`${this.API_URL}/document/previewFile?documentId=${id}`, { responseType: 'arraybuffer' });
  }

  // Preview Document
  previewDocs(docId: number, appId: number) {
    return this.http.get(`${this.API_URL}/creditcard/previewFile?documentId=${docId}&applicationid=${appId}`, { responseType: 'arraybuffer' });
  }

  // Export 
  getExportFile(format: String, filter: DuplicateModel) {
    return this.http.post<DownloadJob>(`${this.API_URL}/batchUpload/by-filter/export?format=${format}`, filter);
  }

  // Get Job
  getJob(id: number) {
    return this.http.get<DownloadJob>(`${this.API_URL}/jobs/${id}`);
  }

  // Get File by Job
  getFilebyJob(id: number) {
    return this.http.get(`${this.API_URL}/jobs/${id}/get-file`, { responseType: 'arraybuffer' });
  }

  // View Details
  viewById(id: number) {
    return this.http.get(`${this.API_URL}${id}`);
  }

  //Case Managemnet View Details

  // get  Header Details
  getHeaderDetailsById() {
    return this.http.get(`${this.API_URL}/category`);
  }
  // View Details
  viewDetailsById(id: number, category: string) {
    return this.http.get(`${this.API_URL}/get/${id}?category=${category}`);
  }

  // Display Fields 
  displayFields(columns) {
    return this.http.post(`${this.API_URL}/display/allfield/values`, columns);
  }

  // Matching Configuration

  // To get all table names of a particular database
  getTable(keyword: string, page: number, pageSize: number, config: configurations) {
    return this.http.post(`${this.API_URL}/datasource/retrieveTableNames?keyword=${keyword}&page=${page}&pageSize=${pageSize}`, config);
  }

  // To get all field names of a particular table
  getFields(tableName: string, keyword: string, page: number, pageSize: number, config: configurations) {
    return this.http.post(`${this.API_URL}/datasource/retrieveFieldNames?tableName=${tableName}&keyword=${keyword}&page=${page}&pageSize=${pageSize}`, config);
  }

  //To get all field names of a Internal Application table
  getAppField(keyword: string, page: number, pageSize: number) {
    return this.http.get(`${this.API_URL}/datasource/retrieveInternalDBFieldNames?keyword=${keyword}&page=${page}&pageSize=${pageSize}`)
  }

  // To get all rule configuration
  getAllRules(page: number, pageSize: number) {
    return this.http.get(`${this.API_URL}/rule/getAll?pageNum=${page}&pageSize=${pageSize}`);
  }

  // To set a rule configuration as active
  getActiveStatus(id: number) {
    return this.http.get(`${this.API_URL}/rule/setAsActiveRule?ruleId=${id}`, { responseType: 'text' });
  }

  // To delete a rule configuration
  deleteRules(id: number) {
    return this.http.delete(`${this.API_URL}/rule/deleteRule?ruleId=${id}`, { responseType: 'text' });
  }

  // To get existing rule configuration
  viewRules(id: number) {
    return this.http.get<config>(`${this.API_URL}/rule/getById?id=${id}`)
  }

  // To create a new Rule
  saveRules(config: config[], ruleName: string, ruleDescription: string, threshold: string) {
    return this.http.post(`${this.API_URL}/rule/create?ruleName=${ruleName}&ruleDescription=${ruleDescription}&threshold=${threshold}`, config)
  }

  // To update existing rule
  updateRules(id: number, status: boolean, Config: config[], ruleName: string, ruleDescription: string, threshold: string) {
    return this.http.put(`${this.API_URL}/rule/update?id=${id}&activeStatus=${status}&ruleName=${ruleName}&ruleDescription=${ruleDescription}&threshold=${threshold}`, Config, { responseType: 'text' })
  }

  // post api to export
  postExportFields(format: string, pageNum: number, displayFields: displayFields) {
    return this.http.post<any>(`${this.API_URL}/export/column?format=${format}&pageNum=${pageNum}`, displayFields);
  }
  //get database Details
  getDatabaseDetail(id: any) {
    return this.http.get(`${this.API_URL}/get/duplicate/preview?id=${id}`);
  }
  //get active rule
  getactiveRule() {
    return this.http.get(`${this.API_URL}/rule/get/activeRule`);
  }
  //get multi submit
  getMultiDbdetails(id: any, stageName: string) {
    return this.http.get(`${this.API_URL}/get/duplicate/preview2?id=${id}&applicationStatus=${stageName}`);
  }
  //get multi row submit 
  getMultirowDbdetails1(id: any, stageName: string) {
    return this.http.get(`${this.API_URL}/get/duplicate/preview2/multiple?id=${id}&applicationStatus=${stageName}`);
  }
  // get app Details
  getAppDetails(id: number) {
    return this.http.get(`${this.API_URL}/applicant-details/get/application/detail/${id}`);
  }
  //find Duplicates
  findDuplicates() {
    return this.http.get(`${this.API_URL}/findDuplicates`);
  }
  //Start Dup Match
  starDupmatch() {
    return this.http.get(`${this.API_URL}/duplicate-match/start`);
  }
  //No match decision
  manualDecision(codeTag: string, dupDecisopn: any, ruleUsed: string, stageName: string) {
    return this.http.post(`${this.API_URL}/case-management/approve?codeTag=${codeTag}&ruleName=${ruleUsed}&applicationStatus=${stageName}`, dupDecisopn, { responseType: 'text' });
  }

  //No match decision
  manualDecisionmultirow(dupDecisionMultirow: any) {
    return this.http.post(`${this.API_URL}/case-management/status`, dupDecisionMultirow, { responseType: 'text' });
  }
  //Proceed
  getProceed(id: any, dupDecisopn: any) {
    return this.http.post(`${this.API_URL}/case-management/proceed?finsurgeId=${id}`, dupDecisopn, { responseType: 'text' });
  }
  //multi-Proceed
  getmultirowProceed(dupDecisopn: any) {
    return this.http.post(`${this.API_URL}/case-management/bulk/confirm`, dupDecisopn, { responseType: 'text' });
  }
  //get multi accept
  getAcceptProceed(id: any, action: string, remarks: string) {
    return this.http.get(`${this.API_URL}/case-manager/change?id=${id}&action=${action}&remarks=${remarks}`);
  }
  //get  Reject app
  getRejectProceed(id: any, action: string) {
    return this.http.get(`${this.API_URL}/case-manager/change?id=${id}&action=${action}`);
  }
  //FRAUD DECISION 

  //No match decision
  fraudDecision(fraudDecision) {
    return this.http.post(`${this.API_URL}/case-management/status`, fraudDecision, { responseType: 'text' });
  }

  //EMPLOYEE decision
  employeeDecision(id: any, action: string) {
    return this.http.get(`${this.API_URL}/case-management/action?id=${id}&action=${action}`);
  }
  // get Product loan dropdown
  getProductLoan(loanType: string) {
    return this.http.get(`${this.API_URL}/applicant-details/interestRates?loanType=${loanType}`)
  }
  getUnderwritingData(id:number){
    return this.http.get<any>(`${this.API_URL}/applicant-details/underwriting/ratio/get?id=${id}`);
  }

  getCreditRate(id:number){
    return this.http.get<any>(`${this.API_URL}/applicant-details/underwriting/credit/get?id=${id}`);
  }

  // save loan config  :
  saveLoanConfig(loanTypeConfig: loanTypeConfig) {
    return this.http.post(`${this.API_URL}/loan-config/save`, loanTypeConfig)
  }
  // list loan config
  getLoanConfig(page: number, pageSize: number) {
    return this.http.get(`${this.API_URL}/loan-config/get-all?page=${page}&pageSize=${pageSize}`);
  }
  // list loan config
  getUserDefine(page: number, pageSize: number) {
    return this.http.get(`${this.API_URL}/custom-field/get-all?page=${page}&pageSize=${pageSize}`);
  }
  //Save User Defined Fields
  saveUserFields(userFields: UserDefinedFields) {
    return this.http.post(`${this.API_URL}/custom-field/save`, userFields)
  }
  // // get user defined fields
  getUDFDetails(appId: number, tab: string, subTab: string) {
    return this.http.get(`${this.API_URL}/applicant-details/get/app-custom-fields?appId=${appId}&tab=${tab}&subTab=${subTab}`);
  }

  getUDF(moduleName: string) {
    return this.http.get(`${this.API_URL}/custom-field/get/by-module-name?moduleName=${moduleName}`);
  }
  //Get Country and Country Dropdown 
  getCurrencyByCountry() {
    return this.http.get(`${this.API_URL}/loan-config/get-countries-currencies`);
  }
  // To delete a Loan configuration
  deleteLoanConfig(id: number) {
    return this.http.delete(`${this.API_URL}/loan-config/delete/${id}`, { responseType: 'text' });
  }
  // To delete a User Define Fields configuration
  deleteUserDefineFields(id: number) {
    return this.http.delete(`${this.API_URL}/custom-field/delete/${id}`, { responseType: 'text' });
  }
  saveCurrencyAndCountry(currencyConfig: CurrencyConfiguration) {
    return this.http.post(`${this.API_URL}/currency/save/currency`, currencyConfig)
  }
  getCountryList(page: number, pageSize: number) {
    return this.http.get(`${this.API_URL}/currency/get-all?page=${page}&pageSize=${pageSize}`);
  }
  deleteCountry(id: number) {
    return this.http.delete(`${this.API_URL}/currency/delete/${id}`, { responseType: 'text' });
  }
  saveCollateralConfig(collateralConfig: CollateralField) {
    return this.http.post(`${this.API_URL}/collateral/save`, collateralConfig)
  }
  getCollateralTypeDropdown(collateralCategory: string) {
    return this.http.get(`${this.API_URL}/loan-config/get/collateral-type?category=${collateralCategory}`)
  }
  getCollateralConfig(page: number, pageSize: number) {
    return this.http.get(`${this.API_URL}/collateral/get-all?page=${page}&pageSize=${pageSize}`);
  }
  deleteCollateralConfig(id: number) {
    return this.http.delete(`${this.API_URL}/collateral/delete/${id}`, { responseType: 'text' });
  }
  getLoanTransactionData(id: number){
    return this.http.get<any>(`${this.API_URL}/applicant-details/loan-transaction-log?id=${id}`);
  }
  //Search API for Configuration
  searchCurrencyConfig(seachItem: string) {
    return this.http.get(`${this.API_URL}/currency/search?searchTerm=${seachItem}`);
  }
  searchDuplicateRules(seachItem: string) {
    return this.http.get(`${this.API_URL}/rule/search?searchTerm=${seachItem}`);
  }
  searchLoanConfig(seachItem: string){
    return this.http.get(`${this.API_URL}/loan-config/search?searchTerm=${seachItem}`);
  }
  searchCollateralConfig(seachItem: string){
    return this.http.get(`${this.API_URL}/collateral/search?searchTerm=${seachItem}`);
  }
  searchUserDefineConfig(seachItem: string){
    return this.http.get(`${this.API_URL}/custom-field/search?searchTerm=${seachItem}`);
  }
}
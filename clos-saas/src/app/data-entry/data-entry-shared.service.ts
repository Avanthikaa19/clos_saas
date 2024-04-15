import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class DataEntrySharedService {

  public applicationForm: NgForm | undefined;
  private selectedFieldSubject = new BehaviorSubject<string>(null);
  selectedField$ = this.selectedFieldSubject.asObservable();

  private dataSubject = new Subject<boolean>();
  private fileUploadDataSubject = new Subject<boolean>();
  private fileUploadUpdateDataSubject = new Subject<boolean>();
  private createEditOptionSelect = new Subject<string>();
  savedata = this.dataSubject.asObservable();
  fileUploadData = this.fileUploadDataSubject.asObservable();
  fileUploadUpdateData = this.fileUploadUpdateDataSubject.asObservable();
  createEditSelect=this.createEditOptionSelect.asObservable();
  
  inputValue: any;
  applicationFormData: any;
  addressFormdata: any;
  personalFormdata: any;
  supplementaryFormData: any;
  employmentFormData: any;
  cardDetailsFormData:any;
  evaluationFormData:any;
  spouseFormData: any;
  personalRefFormData:any;
  sidenavInfo:string;
  activerStepperstatus:boolean
  loanFormData: any;
  subTabaName:string;
  conditionStatus:boolean;
  finId:number
  errorStatus:boolean;
  submitId:number

  API_URL: string = '';
  createEditSelection: string;

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) { 

    this.API_URL = this.configurationService.apiUrl().services.loan_data_service;
  }

  getInputValue(): any {
    return this.inputValue;
  }

  setInputValue(value: any): void {
    this.inputValue = value;
  }

  resetInputValue(): void {
    this.inputValue = null;
  }

  //FORM VALIDITY

  //Application Form Valid 

  setApplicationFormValidity(form) {
    this.applicationFormData = form;
  }
  getApplicationFormValidity(): void {
    return this.applicationFormData
  }

  //Address Form Valid

  setAddressFormValidity(form) {
    this.addressFormdata = form;
  }
  getAddressFormValidity() {
    return this.addressFormdata;
  }

  //Personal Info Valid

  setPersonalInfoFormValidity(form) {
    this.personalFormdata = form;
  }
  getPersonalInfoFormValidity() {
    return this.personalFormdata
  }

  //supplementray Info Valid

  setSupplementaryInfoFormValidity(form) {
    this.supplementaryFormData = form
  }
  getSupplementaryInfoFormValidity() {
    return this.supplementaryFormData;
  }

  //employmet Info Valid

  setEmploymentInfoFormValidity(form) {
    this.employmentFormData = form
  }
  getEmploymentInfoFormValidity() {
    return this.employmentFormData;
  }

  //Card details form valid
  setCardDetailsInfoFormValidity(form){
    this.cardDetailsFormData= form;
  }
  getCardDetailsInfoFormValidity(){
    return this.cardDetailsFormData;
  }

  //evaluation form valid

  setEvaluationInfoFormValidity(form){
    this.evaluationFormData= form;
  }
  getEvaluationInfoFormValidity(){
    return this.evaluationFormData
  }

  //spouse form valid

  setSpouselInfoFormValidity(form){
    this.spouseFormData= form;
  }
  getSpouselInfoFormValidity(){
    return this.spouseFormData;
  }

  //personal ref form valid

  setPersonalReferenceInfoFormValidity(form){
    this.personalRefFormData= form;
  }
  getPersonalReferenceInfoFormValidity(){
    return this.personalRefFormData
  }

  //loan detail info 

  setLoanInfoFormValidity(form){
    this.loanFormData= form;
  }
  getLoanInfoFormValidity(){
    return this.loanFormData
  }

  //side navigation click function
  setSideNavInfo(info){
    this.sidenavInfo=info;
  }
getSideNavInfo(){
    return this.sidenavInfo;
  }

  //side navigation clcik function for mat stepper

  setSelectedField(field: string) {
    this.selectedFieldSubject.next(field);
  }

  //after save api active status

  sendData(data: boolean) {
    this.dataSubject.next(data);
  }

  //after fileupload api active status

  sendFileUploadData(data: boolean) {
    this.fileUploadDataSubject.next(data);
  }

   //after fileupload Update api active status

   sendFileUploadUpdateData(data: boolean) {
    this.fileUploadUpdateDataSubject.next(data);
  }

  //supplementary tab 

  setSupplementarySubTabName(subTab){
    this.subTabaName=subTab;
  }

  getSupplementarySubTabName(){
    return this.subTabaName
  }

  //view data entry details 
  getCategoryList(){
    return this.http.get(`${this.API_URL}/data/entry/category/name`);
  }
  getFieldList(id: string,category: string){
    return this.http.get(`${this.API_URL}/data/entry/get/${id}?category=${category}`);
  }

  //create edit data entry 
  setMatSelectOption(data:string){
    this.createEditOptionSelect.next(data);
    this.createEditSelection=data
  }
  getMatSelectOption(){
    return this.createEditSelection
  }

  //check condition whether to update the entry 

  setConditionCheckForUpdate(data:boolean){
    this.conditionStatus=data
  }
  getConditionCheckForUpdate(){
    return this.conditionStatus;
  }
  resetConditionCheckForUpdate(){
    this.conditionStatus=null;
  }

  //GET ID FOR EDIT

  setId(data:number){
    this.finId=data
  }
  getId(){
    return  this.finId
  }
  resetId(){
    this.finId=null;
  }

  //INPUT border color error

  setErrorBorderColor(data:boolean){
    this.errorStatus=data
  }
  getErrorBorderColor(){
    return this.errorStatus
  }
  resetErrorBorderColor(){
    this.errorStatus=null
  }
//ID got while saving data

setSubmitId(data:number){
  this.submitId=data
}
getSubmitId(){
  return this.submitId
}
resetSubmitId(){
  this.submitId=null;
}
}

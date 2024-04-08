import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data-service';
import { SaasService } from '../services/saas-service';
import { UrlService } from '../services/url-service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  countries:any=['INDIA','MALAYSIA','ENGLAND','SINGAPORE','HONG-KONG'];
  firstname:any='';
  lastname:any='';
  companyname:any='';
  date:any='';
  hr:any='';
  min:any='';
  ampm:any='';
  email:any='';
  phn:any='';
  demovideo:boolean=false;
  countryName:any='';
  companies: any[] = [{}]; // Initialize with at least one input box
  position:any='';
  role:any='';
  roleList:any=['SUPER','ADMIN','NORMAL']
  file:any;
  onefileuploaded:boolean=false;
  id:any=0;
  domainName:any='';
  responseUrl:any;
  errMessage:any='';
  errMessageForNumbers:any='';
  orgValidation:any='';
  domainValidation:any='';
  
 
 async ngOnInit() {
    // this.dateFormat = await this.formatDate();
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    this.responseUrl=response;
    console.log(response)
  }


  public updateUrl() {
    console.log('hiiii')
    return this.url.getUrl().toPromise().then();
  }
    removeCompany(index: number) {
      this.companies.splice(index, 1);
  }
  @ViewChild('fileInput')fileInput!: ElementRef;
  triggerFileInputClick() {
    this.fileInput?.nativeElement?.click();
  }
  handleFileInput(event: any, index: number) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
        const file: File = fileList[0];
        console.log('File selected:', file);
        this.companies[index] = file.name;
    }
    if(this.companies[index]?.length>1){
      this.onefileuploaded=true;
    }
    
}
logoutConfirm:boolean=false;
onCancelClick(){
  this.logoutConfirm=false;
}
mailValidation(emailId) {
  this.errMessage = null!;
  //PATTERN TO CHECK VALID MAIL 
  const emailPattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const validEmail = emailPattern.test(String(emailId).toLowerCase());
  if (!validEmail) {
    this.errMessage = 'Please enter valid email Id';
    return;
  }
}
numberValidation(inputValue: string) {
  this.errMessageForNumbers = null!;
  const numberPattern = /^[0-9]{10}$/;
  const isValidNumber = numberPattern.test(inputValue);
  if (!isValidNumber) {
    this.errMessageForNumbers = 'Please enter a valid 10-digit mobile number';
    return;
  }
}

signup(){
  const newHost = `${this.domainName}.${window.location.host}`;
  const newUrl = `http://${this.domainName}.${window.location.hostname}:4200/signup/login`;
  this.responseUrl=newUrl;
  this.saasService.getUserSignUp(null,this.companyname,`${this.domainName}.finsurge.tech`,this.firstname,this.password,this.email,this.phn).subscribe(
    (res:any)=>{
     console.log(res)
     this.newId=res['id'];
     this.uploadDocument();
     this.createDB();
    }
  )
}
hidePassword: boolean = true
togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
newId:any='';
createDB(){
  this.saasService.getDataBaseForOrg(this.newId).subscribe(
    res=>{
      console.log(res)
    }
  )
}
files: File[] = [];
onFileSelected(event: any): void {
  // Extract files from the event
  const selectedFiles: FileList = event.target.files;
  
  // Iterate over the selected files and add them to the files array
  for (let i = 0; i < selectedFiles.length; i++) {
    this.files.push(selectedFiles[i]);
  }
}
addFileInput(): void {
  this.companies.push({});
}

uploadDocument(){
  console.log(this.companies,this.files)
  this.saasService.getUploadedDocuments(this.newId,this.files).subscribe(
    res=>{
      console.log(res);
    }
  )
}
password:any='';
  done() {
    const newHost = `${this.domainName}.${window.location.host}`;
    console.log(window.location)
    const newUrl = `http://${this.domainName}.${window.location.hostname}:4200/signup/login`;
    console.log(newUrl,'new url')
    this.responseUrl=newUrl;
    const responseData = {
      firstname: this.firstname,
      lastname: this.lastname,
      position: this.position,
      role: this.role,
      email: this.email,
      phn: this.phn,
      companyname: this.companyname,
      domainName: this.domainName,
      countryName: this.countryName,
  };
    this.transferDataService.setData(responseData)
    sessionStorage.setItem('newurl',newUrl)
    sessionStorage.setItem('domain',this.domainName)
}
clearAll(){
  this.firstname='';
  this.lastname='';
  this.position='';
  this.role='';
  this.email='';
  this.phn='';
  this.companyname='';
  this.domainName='';
  this.countryName='';
  this.companies=[''];
}
copyTokenToClipboard() {
  let token = this.responseUrl;
  if (token) {
    var copyElement = document.createElement("textarea");
    copyElement.style.position = 'fixed';
    copyElement.style.opacity = '0';
    copyElement.textContent = token;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyElement);
    copyElement.select();
    document.execCommand('copy');
    body.removeChild(copyElement);
    return;
  }
}
isResponse:boolean=false;
//VALIDATE-MY-DOMAIN-ORG NAME
validateOrgandDomain(column,value){
   this.saasService.getValidatedOrgAndDomain(column,value).subscribe(
     res=>{
       console.log(res)
       this.isResponse=true;
       this.orgValidation=res['status']
     },
     err=>{
       console.log(err)
       this.isResponse=false;
       this.orgValidation=err.error['status']
     }
   )
}
timer:any;
getMyValidation(event,col,val){
  if (event != null) {
    if (event.length > 0 || event.length == undefined) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.validateOrgandDomain(col,val) }, 1000)
    }
    }
}

component_height:any;
@HostListener('window:resize', ['$event'])
updateComponentSize() {
  this.component_height = window.innerHeight;
}
  constructor(
    public transferDataService:DataService,
    public router:Router,
    public url:UrlService,
    public saasService:SaasService,
  ) {
    this.updateComponentSize();
   }
}

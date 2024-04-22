import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SaasService } from '../saas-service';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { DataService } from '../data-service';
import { SnackbarComponent } from 'src/app/dynamic-dashboard/snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  companies: any[] = [];
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
  emailIdValidation:boolean=false;
  existingEmail:any='';
  
 
 async ngOnInit() {
    // this.dateFormat = await this.formatDate();
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    this.responseUrl=response;
    console.log(response)
    console.log(window.location)
    this.clearAll();
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
  const newUrl = `http://${this.domainName}.${window.location.host}/signup/login`;
  this.responseUrl=newUrl;
  this.saasService.getUserSignUp(null,this.companyname,`${this.domainName}.finsurge.tech`,this.firstname,this.password,this.email,this.phn).subscribe(
    (res:any)=>{
     console.log(res)
     this.newId=res['id'];
     this.uploadDocument();
     const data={
       id:this.newId,
       email:this.email,
       name:this.firstname,
       domain:this.domainName,
       password:this.password,
       phn:this.phn,
       company:this.companyname,
       country:this.countryName,
     }
     this.transferDataService.setData(data);
     this.demovideo=true;
    },
    err=>{
      console.log(err)
    }
  )
}
addFileInput(): void {
  this.companies.push({});
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

uploadDocument(){
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
    const newUrl = `http://${this.domainName}.${window.location.host}/#/signup/login`;
    console.log(newUrl,'new url')
    this.responseUrl=newUrl;
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
    public router:Router,
    public url:UrlService,
    public saasService:SaasService,
    public transferDataService:DataService,
    public snackbar:MatSnackBar,
  ) {
    this.updateComponentSize();
   }
   navigateToPage(param){
    this.router.navigate([`${param}`])
  }
validateDomain(column,value){
  this.saasService.getValidatedOrgAndDomain(column,value).subscribe(
    res=>{
      console.log(res)
      this.isResponse=true;
      this.domainValidation=res['status']
    },
    err=>{
      console.log(err)
      this.isResponse=false;
      this.domainValidation=err.error['status']
    }
  )
}
filesizeErr:any='';
checkFileExtension(fileName: string): boolean {
  const allowedExtensions = ['.jpg', '.jpeg', '.pdf','.xlsx'];

  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return allowedExtensions.includes(extension);
}

onFileSelected(event: any) {
  const files:FileList = event.target.files;
  const invalidFiles: string[] = [];

  for (let i = 0; i < files.length; i++) {
    if (!this.checkFileExtension(files[i].name)) {
      invalidFiles.push(files[i].name);
    }
    this.files?.push(files[i])
  }

  if (invalidFiles.length > 0) {
    this.openErrSnackbar('Invalid file(s) selected. Only JPG, JPEG, and PDF files are allowed.');
    event.target.value = null;
  }
  this.onefileuploaded=true;
}
hide:boolean=true;
myFunction() {
  this.hide = !this.hide;
}
removeDocument(index: number) {
  this.companies.splice(index, 1); // Remove the div at the specified index
}

checkFileSize(event: any) {
  const files = event.target.files;
  const maxFileSize = 2 * 1024 * 1024; // 2MB

  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxFileSize) {
      this.openErrSnackbar('File Size exceeds 2MB. Please choose a smaller one')
      event.target.value = null;
      return;
    }
  }
}
getMyDomainValidation(event,col,val){
  if (event != null) {
    if (event.length > 0 || event.length == undefined) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.validateDomain(col,val) }, 1000)
    }
    }
}
//VALIDATE-EMAIL
validateEmail(email){
    this.saasService.validateEmailOfUsers(email).subscribe(
      res=>{
        console.log(res)
        if(res['status']!=='Unavailable Email Id'){
          this.emailIdValidation=true;
          this.existingEmail=res['status']
          let emailvalId=res['id'];
          const data={
            id:emailvalId
          }
          this.transferDataService.setData(data)
        }
      },
      err=>{
        console.log(err)
        this.emailIdValidation=false;
      }
    )
}
//EMAIL VALIDATION
getMyEmailValidation(event,col){
  if (event != null) {
    if (event.length > 0 || event.length == undefined) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.validateEmail(col);}, 1000)
    }
    }
}
openErrSnackbar(message){
  this.snackbar.openFromComponent(SnackbarComponent, {
  panelClass: ['error-snackbar'],duration: 5000,
  data: {
   message: message, icon: 'error_outline',type:'error'
  }
   });
  }

}

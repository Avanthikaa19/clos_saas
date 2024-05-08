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
  description:any=[];
  countriesList:any=[];
  addDocx:boolean=false;
  fileUploaded: boolean[] = []; // Array to track whether each file is uploaded
  contactNo:any;
  contactMail:any;
  showMoreInfo:boolean=false;
  showMoreemail:boolean=false;
  showmorephn:boolean=false;
  showmorecompany:boolean=false;
  showmoredomain:boolean=false;
  showmoreposition:boolean=false;
  showmorerole:boolean=false;

  
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
 
 async ngOnInit() {
    // this.dateFormat = await this.formatDate();
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    this.responseUrl=response;
    console.log(response)
    console.log(window.location)
    this.clearAll();
    this.getAllCountries();
    this.getContactInfo();
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
     this.addDocx=false;
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
  this.description?.push('')
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
  for (let i = 0; i < this.description.length; i++) {
    const description = this.description[i];
    const files = this.files.filter((_, index) => this.description[index] === description);

    // Create a new FormData object for this set of files and description
    const formData = new FormData();
    formData.append('description', description);
    for (let j = 0; j < files.length; j++) {
      formData.append('files', files[j], files[j].name);
    }

    // Make the API call for this description and its files
    this.saasService.getUploadedDocuments(this.newId, files, description).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.error(error);
      }
    );
  }
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

onFileSelected(event: any,index) {
  const files: FileList = event.target.files;
  const invalidFiles: string[] = [];

  for (let i = 0; i < files.length; i++) {
    if (!this.checkFileExtension(files[i].name)) {
      invalidFiles.push(files[i].name);
    } else {
      // Push the valid file to the files array
      this.files.push(files[i]);
      
    }
  }

  if (invalidFiles.length > 0) {
    this.openErrSnackbar('Invalid file(s) selected. Only JPG, JPEG, and PDF files are allowed.');
    event.target.value = null;
  }
  this.fileUploaded[index]=true;
}

hide:boolean=true;
myFunction() {
  this.hide = !this.hide;
}
removeDocument(index: number) {
  this.companies.splice(index, 1); // Remove the div at the specified index
  this.description?.splice(index,1)
  this.fileUploaded.splice(index, 1);
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
          this.getDetailsById(emailvalId)
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
paymentOption:any='';
userName:any='';
expiryDate:any='';
approvalStatus:any='';
getDetailsById(id){
  this.saasService.getDetailsById(id).subscribe(
    (res:any)=>{
      this.paymentOption=res['paymentStatus'];
      this.userName=res['userName'];
      this.expiryDate=res['trialExpiryDate'];
      this.approvalStatus=res['approval'];
      let domain=res['domain'];
      this.domainName=domain?.split('.')[0]
      const data={
        id:res?.id,
        name:res?.userName,
        email:res?.emailId,
        phn:res?.phoneNo,
        domain:res?.domain,
        payemtAmt:res?.amountPaid,
        paymentOption:res?.subscriptionPlan
      }
      this.transferDataService.setData(data)
    },
    err=>{
      console.log(err)
    }
  )
}
mandatoryDocx:any=[];
//GET-DOCUMENTS-BASED-ON-COUNTRY
getMandatoryDocumentsBasedOnCountry() {
  this.description = [];
  this.companies=[];
  this.saasService.getDocumentsBasedOnCountry(this.countryName).subscribe(
    res => {
      console.log(res);
      this.mandatoryDocx=res['data']
      res['data']?.forEach(document => {
        console.log(document);
        this.companies?.push({})
        this.description?.push(document);
      });
    },
    err => {
      console.log(err);
    }
  );
}
isMandatory(index: number): boolean {
  const mandatoryDescriptions = this.mandatoryDocx;
  return mandatoryDescriptions.includes(this.description[index]);
}
allDocumentsUploaded(): boolean {
  return this.fileUploaded.every(upload => upload);
}

anyMandatoryDocumentNotUploaded(): boolean {
  return this.description.some((_, index) => this.isMandatory(index) && !this.fileUploaded[index]);
}
//GET-COUNTRIES-LIST
getAllCountries(){
  this.saasService.getListOfCountries().subscribe(
    res=>{
      this.countriesList=res['data'];
    },
    err=>{
      console.log(err)
    }
  )
}
getContactInfo(){
  this.saasService.getContactInfo().subscribe(
    res=>{
      console.log(res)
      this.contactNo = res['data'].supportMobile;
      this.contactMail = res['data'].supportMail;
    }
  )
}
}

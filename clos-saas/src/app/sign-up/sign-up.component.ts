import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data-service';
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
  companies: string[] = [''];
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
  
 
 async ngOnInit() {
    // this.dateFormat = await this.formatDate();
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.responseUrl=response;
    console.log(response)
  }


  public updateUrl() {
    console.log('hiiii')
    return this.url.getUrl().toPromise().then();
  }

    addNewCompany() {
        this.companies.push('');
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
  this.id++;
  this.transferDataService.setData(this.id);
  const newHost = `${this.domainName}.${window.location.host}`;
  const newUrl = `http://${this.domainName}.localhost:4200/#/login`;
  // this.router.navigate(['/login'])
    console.log(newUrl,'new url')
    this.responseUrl=newUrl;
    // window.location.href = newUrl;
    console.log(newUrl,window.location)
}
  done() {
    const newHost = `${this.domainName}.${window.location.host}`;
    console.log(window.location)
    const newUrl = `http://${this.domainName}.localhost:4200/#/login`;
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
    this.clearAll();
    this.router.navigate(['/pricing'])
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

component_height:any;
@HostListener('window:resize', ['$event'])
updateComponentSize() {
  this.component_height = window.innerHeight;
}
  constructor(
    public transferDataService:DataService,
    public router:Router,
    public url:UrlService,
  ) {
    this.updateComponentSize();
   }
}

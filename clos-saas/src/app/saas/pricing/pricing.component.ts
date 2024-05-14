import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/saas/data-service';
import { SaasService } from '../saas-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { C } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  minutes:any=['00','01','05','10','15','20','30','45','60']
  hrs:any=['01','02','03','04','05','06','07','08','09','10','11','12'];
  timeofdemo:any=['AM','PM'];
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
  domainName:any='';
  responseUrl:any='';
  freeTrial:boolean=false;
  paymentOption:any='';
  paymentAmt:any='';
  currentDate=null;
  trialExpiryDate=null;
  selectedPayment:string='';
  contactNo:any;
  contactMail:any;
  page:number=1;
  pageSize:number=20;
  pricingList:any=[];
  minNumberOfUsers:any;
  maxNumberOfUsers:any;
  freeTrialUsers:any='';
  freeTrialDate:number;
  freeTrialId:any='';
  done() {
    const newHost = `${this.domainName}.${window.location.host}`;
    console.log(window.location)
    const newUrl = `http://${this.domainName}.localhost:4200/#/signup/login`;
    console.log(newUrl,'new url')
    this.responseUrl=newUrl;
}
clearAll(){
  this.firstname='';
  this.lastname='';
  this.email='';
  this.phn='';
  this.companyname='';
  this.domainName='';
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
id:any='';
emailId:any='';
username:any='';
  constructor(public router:Router,public transferDataService:DataService,public snackBar:MatSnackBar,private sanitizer: DomSanitizer,
    public saasService:SaasService,public datepipe:DatePipe,) { }

  ngOnInit() {
    this.responseUrl=sessionStorage.getItem('newurl');
    this.domainName=sessionStorage.getItem('domain');
    this.transferDataService.getData().subscribe(data => {
      this.id=data?.id;
      this.selectedPayment =data.paymentOption;
      this.emailId=data?.email;
      this.username=data?.name;
    });
    console.log(this.id)
    this.getDetailsById();
    this.getContactInfo();
    this.getPricingList();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  agreeterms(){
    this.closePopup1();
    this.popupVisible=true;
    this.calculateTotal();
  }
  getFreetrial(id){
    let currentDate = new Date();
    let expiryDate = new Date(currentDate);
    if(this.freeTrialUsers=='FREE-TRIAL'){
      expiryDate.setDate(expiryDate.getDate() + this.freeTrialDate);
    }
    let formattedExpiryDate = this.datepipe.transform(expiryDate, 'yyyy-MM-ddT00:00:00');
    this.saasService.getFreeTrial(id,'FREE-TRIAL','PENDING',formattedExpiryDate).subscribe(
       res=>{
         console.log(res)
         this.demovideo=true;
         this.closePopup1();
         this.sendEmailToClients();
       },
       err=>{
         this.demovideo=false;
         console.log(err)
       }
     )
  }
  sendEmailToClients(){
    this.saasService.sendEmailToClient(this.emailId,`Dear ${this.username}`).subscribe(
      res=>{
        console.log(res)
      },
      err=>{
        console.log(err)
      }
    )
  }
  validateInput() {
    if (this.numberOfUsers < this.minNumberOfUsers || this.numberOfUsers > this.maxNumberOfUsers) {
        this.inputError = true;
    } else {
        this.inputError = false;
    }
}
inputError:boolean=false;
  navigateToPage(param){
    this.router.navigate([`${param}`])
    sessionStorage.setItem('paymentAmt',this.paymentAmt?.toString());
    sessionStorage.setItem('minUsers',this.minNumberOfUsers?.toString());
    sessionStorage.setItem('maxUsers',this.maxNumberOfUsers?.toString())
    sessionStorage.setItem('paymentOption',this.paymentOption);
  }
  getDetailsById(){
     this.saasService.getDetailsById(this.id).subscribe(
       (res:any)=>{
         this.paymentOption=res['paymentStatus']
         const data={
           id:res?.id,
           name:res?.userName,
           email:res?.emailId,
           phn:res?.phoneNo,
           domain:res?.domain,
           payemtAmt:this.totalAmount,
           paymentOption:res?.subscriptionPlan,
           approval:res?.approval,
         }
         this.transferDataService.setData(data)
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
  //Number of Users
  totalAmount: number = 0;
  popupVisible: boolean = false;
  popupVisible1: boolean = false;
  numberOfUsers: number = 1;
  openPopup() {
    this.popupVisible =true;
    this.calculateTotal();
  }

  closePopup() {
    this.popupVisible = false;
  }
  closePopup1() {
    this.popupVisible1 = false;
  }

  calculateTotal() {
    this.totalAmount = parseFloat(this.paymentAmt) * this.numberOfUsers;
  }
 //GET-PRICING-LIST
 getPricingList(){
    this.saasService.getPricingList(this.page,this.pageSize,'desc','subscriptionName').subscribe(
      res=>{
        console.log(res)
        this.pricingList=res['data']
      },
      err=>{
        console.log(err)
      }
    )
 }

 decodedPdf: SafeResourceUrl | null = null;
 checked = false;
 encodedPdf2:any;

decodePdf(res) {
 this.encodedPdf2=res['agreement'];
 if (this.encodedPdf2) {
   const byteCharacters = atob(this.encodedPdf2);
   const byteNumbers = new Array(byteCharacters.length);
   for (let i = 0; i < byteCharacters.length; i++) {
     byteNumbers[i] = byteCharacters.charCodeAt(i);
   }
   const byteArray = new Uint8Array(byteNumbers);
   const BLOB = new Blob([byteArray], { type: 'application/pdf' });
   console.log(this.decodedPdf)
   const pdfUrl = URL.createObjectURL(BLOB);
   this.decodedPdf = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);

  }
}
createObjectURL(blob: Blob): string {
 return (window.URL || window.webkitURL).createObjectURL(blob);
}
public sanitizeUrl(url: string): SafeResourceUrl {
 return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
}

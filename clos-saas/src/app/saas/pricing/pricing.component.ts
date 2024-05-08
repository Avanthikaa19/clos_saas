import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/saas/data-service';
import { SaasService } from '../saas-service';

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
  constructor(public router:Router,public transferDataService:DataService,public snackBar:MatSnackBar,
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
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  getFreetrial(id){
    let currentDate = new Date();
    let expiryDate = new Date(currentDate);
    expiryDate.setDate(expiryDate.getDate() + 15);
    let formattedExpiryDate = this.datepipe.transform(expiryDate, 'yyyy-MM-ddT00:00:00');
    this.saasService.getFreeTrial(id,'FREE-TRIAL','PENDING',formattedExpiryDate).subscribe(
       res=>{
         console.log(res)
         this.demovideo=true;
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
  navigateToPage(param){
    this.router.navigate([`${param}`])
    sessionStorage.setItem('paymentAmt',this.paymentAmt);
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

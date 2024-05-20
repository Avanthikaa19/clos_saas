import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { SaasService } from 'src/app/saas/saas-service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  userHeaders:any=['ISSUED DATE','INVOICE ID','DUE DATE','AMOUNT','STATUS','VIEW','DOWNLOAD']
  component_height:any;
  invoice:any=[];
  invoiceCount:any;
  page:number=1;
  pageSize:any=10;
  currentUser:any='';
  loading:boolean=false;
  viewSubscription:boolean=false;
  username:any='';
  orgName:any='';
  subscriptionPlan:any='';
  totalUsers:any='';
  amountPaid:any='';
  invoiceCreatedDate:any='';
  paidBy:any='';
  paymentCycle:any='';
  paymentDate:any='';
  createdDate:any='';
  dueDate:any='';
  invoiceId:any;
  //Payment
  payNow:any='';
  selectedPaymentMethod:any=''
  accountNo:any='';
  ifscCode:any='';
  errMessageForAccountNumber:any='';
  errMessageForIfscCode:any='';
  errMessageForBankerName:any='';
  bankerName:any='';
  bankingInfo:any=[];
  selectedBankInfo:any='';
  paymentMode:any='Direct Bank Transfer';
  description:any='Please transfer amount directly into our bank account . Keep the invoice id as your payment reference .Your service would not be enabled till we receive our payment '
  @HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}
  constructor(
    public saasService:SaasService,
    public url:UrlService,
    public encryptDecryptService:EncryptDecryptService,
    public router:Router,
    public datepipe:DatePipe,
  ) { this.updateComponentSize() }
  public updateUrl() {
    console.log('hiiii')
    return this.url.getUrl().toPromise().then();
  }

  async ngOnInit(): Promise<void> {
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    this.getAllSubscriptionDetails();
    this.getBankDetails();
  }
  getCurrentUser():string{
    if(sessionStorage.getItem(AUTHENTICATED_USER)){
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=this.encryptDecryptService.decryptData(user)}
    return this.currentUser
   }

  //GET-ALL-SUBSCRIPTION-DETAILS
  getAllSubscriptionDetails(){
    this.loading=true;
     this.saasService.getAllSubscriptionDetails(this.page,this.pageSize).subscribe(
       res=>{
         this.loading=false;
         console.log(res)
         this.invoice=res['data']
         this.invoiceCount=res['count']
       },
       err=>{
         console.log(err)
         this.loading=false;
        this.invoice=[];
       }
     )
  }
  //BLOB TO DOWNLOAD THE FILE
  saveFile(atchmt,id) {
    var blob = new Blob([atchmt], {
      type: "application/pdf;charset=utf-8;"
    });
    var downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', `Payments_${id}`);
    downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
    downloadLink.click(); 
  }
  //DOWNLOAD INVOICE
  downloadInvoice(id){
    this.saasService.downloadInvoice(id).subscribe(
      res=>{
        console.log(res)
        this.saveFile(res,id)
      },
      err=>{
        console.log(err)
      }
    )
  }
  //NAVIGATE
  navigateToPage(param){
    this.router.navigate([`${param}`])
  }
  //GET-SUBSCRIPTIONS-BY-ID
  getSubscriptionById(id){
    this.saasService.getSubscriptionsById(id).subscribe(
      res=>{
        console.log(res)
        this.viewSubscription=true;
        this.username=res['username'];
        this.orgName=res['orgName'];
        this.subscriptionPlan=res['subscriptionPlan'];
        this.totalUsers=res['totalUsers'];
        this.amountPaid=res['amount'];
        this.paidBy=res['paidBy'];
        this.paymentCycle=res['paymentCycle'];
        let invoiceCreatedDate=res['invoiceCreatedDate'];
        this.invoiceCreatedDate=this.datepipe.transform(invoiceCreatedDate,'yyyy-MM-dd')
        let paymentDate = res['paymentDate']
        this.paymentDate=this.datepipe.transform(paymentDate,'yyyy-MM-dd')
        let dueDate=res['dueDate'];
        this.dueDate=this.datepipe.transform(dueDate,'yyyy-MM-dd')
      },
      err=>{
        console.log(err)
      }
    )
  }
  getBankDetails(){
    this.saasService.getBankDetails().subscribe(
      res=>{
        let response=res['data'][0]
        this.accountNo=response['accountNumber'];
        this.ifscCode=response['ifscCode'];
        this.bankerName=response['accountHolderName'];
      },
      err=>{
        console.log(err)
      }
    )
 }
}

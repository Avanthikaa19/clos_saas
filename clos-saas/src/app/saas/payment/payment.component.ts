import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/dynamic-dashboard/snackbar';
import { DataService } from 'src/app/saas/data-service';
import { SaasService } from '../saas-service';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  minutes:any=['00','01','05','10','15','20','30','45','60']
  hrs:any=['01','02','03','04','05','06','07','08','09','10','11','12'];
  timeofdemo:any=['AM','PM'];
  currency:any='';
  address1:any='';
  companyname:any='';
  address2:any='';
  city:any='';
  state:any='';
  ampm:any='';
  email:any='';
  phn:any='';
  demovideo:boolean=false;
  countryName:any='';
  countries:any=['INDIA','MALAYSIA','ENGLAND','SINGAPORE','HONG-KONG'];
  currencies:any=['USD','MYR','POUNDS','SGD','YEN']
  responseUrl:any='';
  paymentMethod:any='';
  constructor(public transferDataService:DataService,public snackBar:MatSnackBar,public router:Router,
    public saasService:SaasService,public datepipe:DatePipe,) {
      this.updateComponentSize()
    }
  userName:any='';
  password:any='';
  domain:any='';
  paymentId:any='';
  paymentAmt:any='';
  paymentOption:any='';
  billingPeriod:any='';
  lastpaymentDate=null;
  upcomingDueDate=null;
  subscribedDate=null;
  unsubscribedDate=null;
  postalCode:any='';
  generateBill:boolean=false;
  contactNo:any;
  contactMail:any;
  component_height:any;
  minNumberOfUsers:any;
  maxNumberOfUsers:any;
  approval:any='';
  totalUsers:number;
  accountNo:any='';
  bankerName:any='';
  ifscCode:any='';
  paymentMode:any='Direct Bank Transfer';
  description:any='Your service would not be enabled till we receive our payment '
	@HostListener('window:resize', ['$event'])
	updateComponentSize() {
		this.component_height = window.innerHeight;
	}

  async ngOnInit() {
    this.responseUrl=sessionStorage.getItem('newurl');
    this.transferDataService.getData().subscribe(data => {
      this.companyname=data?.company;
      this.countryName=data?.country;
      this.email=data?.email;
      this.phn=data?.phn;
      this.domain=data?.domain;
      this.paymentId=data?.id;
      this.userName=data?.name;
      this.password=data?.password;
      let amt=sessionStorage.getItem('paymentAmt');
      this.paymentAmt=parseFloat(amt);
      this.totalAmount = this.paymentAmt;
      let min=sessionStorage.getItem('minUsers')
      this.minNumberOfUsers=parseFloat(min);
      let max=sessionStorage.getItem('maxUsers')
      this.maxNumberOfUsers=parseFloat(max)
      this.paymentOption=sessionStorage.getItem('paymentOption')
      this.paymentOption=sessionStorage.getItem('paymentOption');
      this.approval=data?.approval;
      this.totalUsers=data?.users;
      this.billingPeriod=sessionStorage.getItem('billingPeriod')
      console.log(this.billingPeriod)
      console.log(data)
    });
    this.calculateNextBillingDate(this.billingPeriod)
  this.lastpaymentDate=this.datepipe.transform(new Date(), 'yyyy-MM-ddT00:00:00')
  this.subscribedDate=this.datepipe.transform(new Date(), 'yyyy-MM-ddT00:00:00')
  this.getContactInfo();
  }
clearAll(){
  this.companyname='';
  this.countryName='';
  this.currency='';
  this.address1='';
  this.city='';
  this.state='';
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
openSnackBar(message, action) {
  this.snackBar.openFromComponent(SnackbarComponent, {
    panelClass: ['success-snackbar'], duration: 5000,
    data: {
      message: message, icon: 'done', type: 'success', action: action
    }
  });
}
navigateToPage(param){
  this.router.navigate([`${param}`])
}
calculateNextBillingDate(billingPeriod: string) {
  const currentDate = new Date();
  console.log(billingPeriod,'billing-period')
  if (billingPeriod === 'monthly') {
    currentDate.setMonth(currentDate.getMonth() + 1);
  } else if (billingPeriod === 'annually') {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
  }
  this.unsubscribedDate = this.datepipe.transform(currentDate, 'yyyy-MM-ddT00:00:00');
  this.upcomingDueDate = this.datepipe.transform(currentDate, 'yyyy-MM-ddT00:00:00');
}
sendEmailToClients(){
  this.saasService.sendEmailToClient(this.email,`Hi ${this.userName}`).subscribe(
    res=>{
      console.log(res)
    },
    err=>{
      console.log(err)
    }
  )
}
proceedPayment(){
  this.calculateNextBillingDate(this.billingPeriod)
  this.lastpaymentDate=this.datepipe.transform(new Date(), 'yyyy-MM-ddT00:00:00')
  this.subscribedDate=this.datepipe.transform(new Date(), 'yyyy-MM-ddT00:00:00')
  let approvalStatus:any='';
  if(this.approval==null||this.approval==undefined||this.approval==''){
    approvalStatus='PENDING'
  }
  else{
    approvalStatus=this.approval;
  }
   this.saasService.getPaymentTrial(this.paymentId,null,this.companyname,this.domain,this.userName,this.password,this.email,this.phn,this.billingPeriod,this.totalAmount,true,this.lastpaymentDate,this.paymentAmt,this.upcomingDueDate,this.paymentOption,this.subscribedDate,this.unsubscribedDate,this.paymentOption,approvalStatus,this.currency,this.countryName,this.address1,this.address2,this.postalCode,this.city,this.state,this.numberValue).subscribe(
     res=>{
       console.log(res);
       this.sendEmailToClients();
       this.downloadAsPdf();
       if(this.paymentMethod=='bankTransfer'){
       this.demovideo=true;
       this.getBankDetails();
       }
       else{
         this.getExistingInvoiceDetailsById();
         this.getExistingInvoiceDetailsByDomain();
       }
     },
     err=>{
       console.log(err)
       }
   )
}
getPaypalintegration(id){
  console.log(id)
    this.saasService.getPayPalLink(this.paymentAmt,this.currency,id).subscribe(
      res=>{
        console.log(res)
      },
      err=>{
        console.log(err)
        if (err.status === 200 && err.error && err.error['text']) {
          const match = err.error['text'].match(/redirect:(.*)/);
          if (match && match[1]) {
            const redirectUrl = match[1].trim();
            if (redirectUrl) {
              window.open(redirectUrl, '_blank');
            } else {
              console.log('Redirect URL not found in the error text');
            }
          } else {
            console.log('Redirect URL not found in the error text');
          }
        } else {
          console.log('Unexpected error format or status code');
        }
      }
    )
}
existingInvoice:any=[];
invoiceId:any;
//UPDATE-INVOICE
getExistingInvoiceDetailsById(){
    this.saasService.getInvoiceDetailsById(this.paymentId).subscribe(
      (res:any)=>{
        console.log(res)
        this.existingInvoice=res;
        this.getPaypalintegration(res[0]?.id)
      }
    )
}
//GET-INVOICE-DETAILS-BY-DOMAIN
getExistingInvoiceDetailsByDomain(){
   this.saasService.getInvoiceDetailsByDomain().subscribe(
     (res:any)=>{
       console.log(res)
       this.existingInvoice=res;
       this.getPaypalintegration(res[0]?.id)
      }
   )
}
//UPDATE-INVOICE-BASED-ON-INFO
updateInvoice(blob) {
  // Upload the blob to the API
  this.saasService.updateInvoiceOfPayment(this.paymentId, blob).subscribe(
    res => {
      console.log(res);
      this.saveInvoiceDetails(this.invoiceId);
    },
    err => {
      console.error('Error uploading PDF:', err);
    }
  );
}
//convert the mat-card bill into pdf
downloadAsPdf() {
  setTimeout(() => {
    var pdfTable: any = document.getElementById('page');
    const dashboardHeight = pdfTable.scrollHeight;
    const dashboardWidth = pdfTable.clientWidth;
    const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };
    const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
    let totalPages = 1;
    let currentPage = 1;
    let contentY = 0;
    //Conversion of dom into img
    domtoimage.toPng(pdfTable, options).then((imgData) => {
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const pageHeight = doc.internal.pageSize.getHeight();
      totalPages = Math.ceil(dashboardHeight / pageHeight);

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.setFont("arial", "italic","bold");
      doc.setFontSize(20);
      doc.setTextColor(0,0,0);
      // doc.text('Strictly Private & Confidential', 15, 15);

      contentY += pageHeight;
      currentPage++;

      while (currentPage <= totalPages) {
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, -contentY, pdfWidth, pdfHeight);
        doc.setFont("arial", "italic","bold");
        doc.setFontSize(14);
        contentY += pageHeight;
        currentPage++;
      }
      const blob = doc.output('blob');
      if(this.existingInvoice?.length > 0){
      this.updateInvoice(blob);
      }
      else{
        this.uploadPdfToAPI(blob)
      }
    })
    .catch((error) => {
      console.error('Error capturing content:', error);
    });
  }, 5000);
}
//Convert the file as pdf in API
uploadPdfToAPI(blob) {
  // Upload the blob to the API
  this.saasService.uploadInvoiceOfPayment(this.paymentId, blob,this.paymentOption).subscribe(
    res => {
      console.log(res);
      let newId=res['id'];
      console.log(newId,'hii')
      this.saveInvoiceDetails(newId);
    },
    err => {
      console.error('Error uploading PDF:', err);
    }
  );
}
//SAVE-INVOICE
saveInvoiceDetails(id){
   this.saasService.getSubscription(this.totalAmount,this.numberValue,this.paymentOption,id,this.billingPeriod,this.userName).subscribe(
     res=>{
       console.log(res)
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
numberValue: number = 1;
totalAmount:number;

increaseNumber() {
  console.log(this.maxNumberOfUsers)
  if(this.numberValue<this.maxNumberOfUsers)
  this.numberValue++;
  this.calculateTotal();
}

decreaseNumber() {
  if (this.numberValue > this.minNumberOfUsers) {
    this.numberValue--;
    this.calculateTotal();
  }
}
calculateTotal() {
  this.totalAmount = parseFloat(this.paymentAmt) * this.numberValue;
  console.log(this.totalAmount)
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

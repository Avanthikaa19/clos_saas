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
  currencies:any=['INR','MYR','POUNDS','SGD','YEN']
  responseUrl:any='';
  constructor(public transferDataService:DataService,public snackBar:MatSnackBar,public router:Router,
    public saasService:SaasService,public datepipe:DatePipe,) {}
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


  ngOnInit() {
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
      this.paymentOption=sessionStorage.getItem('paymentOption')
      console.log(data)
    });
    this.calculateNextBillingDate(this.billingPeriod)
  this.lastpaymentDate=this.datepipe.transform(new Date(), 'yyyy-MM-ddT00:00:00')
  this.subscribedDate=this.datepipe.transform(new Date(), 'yyyy-MM-ddT00:00:00')
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
  if (billingPeriod === 'MONTHLY') {
    currentDate.setMonth(currentDate.getMonth() + 1);
  } else if (billingPeriod === 'ANNUALLY') {
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
   this.saasService.getPaymentTrial(this.paymentId,null,this.companyname,this.domain,this.userName,this.password,this.email,this.phn,this.billingPeriod,this.paymentAmt,true,this.lastpaymentDate,this.paymentAmt,this.upcomingDueDate,this.paymentOption,this.subscribedDate,this.unsubscribedDate,this.paymentOption,'PENDING',this.currency,this.countryName,this.address1,this.address2,this.postalCode,this.city,this.state).subscribe(
     res=>{
       console.log(res);
       this.sendEmailToClients();
       this.downloadAsPdf();
       this.demovideo=true;
     },
     err=>{
       console.log(err)
     }
   )
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
      this.uploadPdfToAPI(blob);
    })
    .catch((error) => {
      console.error('Error capturing content:', error);
    });
  }, 5000);
}
//Convert the file as pdf in API
uploadPdfToAPI(blob) {
  // Upload the blob to the API
  this.saasService.uploadInvoiceOfPayment(this.paymentId, blob).subscribe(
    res => {
      console.log(res);
    },
    err => {
      console.error('Error uploading PDF:', err);
    }
  );
}
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data-service';
import { SnackbarComponent } from '../snackbar';

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
  constructor(public transferDataService:DataService,public snackBar:MatSnackBar,) { }

  ngOnInit() {
    this.responseUrl=sessionStorage.getItem('newurl');
    this.transferDataService.getData().subscribe(data => {
      this.companyname=data?.companyname;
      this.countryName=data?.countryName;
      this.email=data?.email;
      this.phn=data?.phn;
    });
  }
  done() {
    this.clearAll();
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
  this.openSnackBar('Link copied successfully',null)
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

}

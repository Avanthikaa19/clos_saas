import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from '../data-service';

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

  done() {
    const newHost = `${this.domainName}.${window.location.host}`;
    console.log(window.location)
    const newUrl = `http://${this.domainName}.localhost:4200/signup/login`;
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
  constructor(public router:Router,public transferDataService:DataService,public snackBar:MatSnackBar) { }

  ngOnInit() {
    this.responseUrl=sessionStorage.getItem('newurl');
    this.domainName=sessionStorage.getItem('domain');
    this.transferDataService.getData().subscribe(data => {
      console.log(data)
      this.companyname=data?.companyname;
      this.firstname=data.firstname;
      this.lastname=data?.lastname;
      this.email=data?.email;
      this.phn=data?.phn;
      this.domainName=data?.domainName;
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

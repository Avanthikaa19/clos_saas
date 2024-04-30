import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/dynamic-dashboard/snackbar';
import { DataService } from '../data-service';
import { SaasService } from '../saas-service';
@Component({
  selector: 'app-saas-login',
  templateUrl: './saas-login.component.html',
  styleUrls: ['./saas-login.component.scss']
})
export class SaasLoginComponent implements OnInit {
  email:any='';
  demovideo:boolean=false;
  loginapp:boolean=false;
  domainName:any='';
  responseUrl:any='';
  component_height:any;
  errMessage:any='';
  emailIdValidation:boolean=false;
  existingEmail:any='';
  timer:any;
  otpLogin:boolean=false;
  @HostListener('window:resize', ['$event'])
  updateComponentSize() {
    this.component_height = window.innerHeight;
  }
  constructor(public snackBar:MatSnackBar,
    public router:Router,public saasService:SaasService,
    public transferDataService:DataService,) {
    this.updateComponentSize();
   }

  ngOnInit(): void {
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
  login(){
    const newHost = `${this.domainName}.${window.location.host}`;
    const newUrl = `http://${this.domainName}.localhost:4200/signup/login`;
    // this.router.navigate(['/login'])
      console.log(newUrl,'new url')
      this.responseUrl=newUrl;
      // window.location.href = newUrl;
      window.location.href=`http://${this.domainName}.${window.location.host}/#/signup/login`
      console.log(newUrl,window.location)
  }
  copyTokenToClipboard() {
    this.openSnackBar('Link copied to clipboard',null)
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
  validateEmail(email){
    this.saasService.validateEmailOfUsers(email).subscribe(
      res=>{
        console.log(res)      
        if(res['status']==='Unavailable Email Id'){
          this.loginapp=false;
          this.existingEmail=res['status'];
          this.emailIdValidation=false;
          console.log('unavailable email id')
        }
        if(res['status']!=='Unavailable Email Id'){
          this.emailIdValidation=true;
          this.otpLogin=true;
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
paymentOption:any='';
userName:any='';
expiryDate:any='';
approvalStatus:any='';
otp1:string='';
otp2:string='';
otp3:string='';
otp4:string='';
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
validateOTP(){
  let otp = parseInt(this.otp1 + this.otp2 + this.otp3 + this.otp4, 10);
  console.log(otp)  
}


}

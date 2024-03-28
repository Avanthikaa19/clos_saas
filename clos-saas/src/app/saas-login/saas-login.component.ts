import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar';

@Component({
  selector: 'app-saas-login',
  templateUrl: './saas-login.component.html',
  styleUrls: ['./saas-login.component.scss']
})
export class SaasLoginComponent implements OnInit {
  email:any='';
  demovideo:boolean=false;
  loginapp:boolean=false;
  domainName='user';
  responseUrl:any='';

  constructor(public snackBar:MatSnackBar,) { }

  ngOnInit(): void {
  }
  login(){
    const newHost = `${this.domainName}.${window.location.host}`;
    const newUrl = `http://${this.domainName}.localhost:4200/signup/login`;
    // this.router.navigate(['/login'])
      console.log(newUrl,'new url')
      this.responseUrl=newUrl;
      // window.location.href = newUrl;
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

}

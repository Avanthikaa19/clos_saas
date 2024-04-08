import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { UrlService } from '../services/url-service';
import * as CryptoJS from "crypto-js";
import { JwtAuthenticationService } from '../services/jwt-authentication-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 username:any='';
 password:any='';
 errorMsg:any='';

  constructor(
    private route: ActivatedRoute, private router: Router,
    public url:UrlService,
    public authenticationService:JwtAuthenticationService,  ) {
   }

 async ngOnInit() {
    // this.dateFormat = await this.formatDate();
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    console.log(response)
  }

  public updateUrl(): Promise<Object> {
    console.log('hiiii')
    return this.url.getUrl().toPromise();
  }
  redirectToHome() {
    const { hostname, port } = window.location;
    const newUrl = `http://${hostname}${port ? ':' + port : ''}/`;
    window.location.href = newUrl;
    console.log(window.location)
}
secretKey = "J@M#B&S*P^T!r~s?r";
login() {
  console.log(window.location)
  if (!this.disable()) {
    const authority = window.location.host.replace('localhost:4200', 'finsurge.tech');
    console.log(authority,'authority')
    // 'Minisha','Fin_ldap#26'
    //encrypt password
    let encPassword: string = "";
    try {
      encPassword = CryptoJS.AES.encrypt(
        this.password,
        this.secretKey
      ).toString();
    } catch (e) {
      console.log(e);
    }
    this.authenticationService
      .executeJWTAuthenticationService(
        this.username,
        encPassword,
        false,
        authority,
      )
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
          if (err.status == 500) {
            this.errorMsg = "Internal Server Error";
          } else {
            this.errorMsg = err.error;
          }
        }
      );
  }
}

disable() {
  if (this.username.length == 0 || this.password.length == 0) {
    return true;
  } else {
    return false;
  }
}

}

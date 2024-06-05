import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";
import { AccessControlData } from "src/app/app.access";
import { ConfigurationService } from "src/app/services/configuration.service";
import { EncryptDecryptService } from "src/app/services/encrypt-decrypt.service";
import { JwtAuthenticationService } from "src/app/services/jwt-authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  userName: string = "";
  password: string = "";
  rememberMe: boolean = false;
  errorMsg: string = "";
  app_header_height = 60;
  envName: string = "";
  component_height;
  @HostListener("window:resize", ["$event"])
  updateComponentSize(event?) {
    this.component_height = window.innerHeight - this.app_header_height;
  }

  secretKey = "J@M#B&S*P^T!r~s?r";

  constructor(
    private authenticationService: JwtAuthenticationService,
    private router: Router,
    public ac: AccessControlData,
    public encryptDecryptService: EncryptDecryptService,
    public url: ConfigurationService
  ) {
    this.updateComponentSize();
  }

  async ngOnInit() {
    let envNameUpdate = await this.envUpdate();
    console.log(envNameUpdate);
    let envData = JSON.parse(
      (await this.url.getConfigurations().toPromise()).toString()
    );
    console.log(envData);
    for (let data of JSON.parse(envNameUpdate.toString()).mappings) {
      if (envData.gateway?.includes(data.apiUrlContains))
        this.envName = data.envName;
    }
  }

  public envUpdate(): Promise<Object> {
    return this.url.getEnvName().toPromise();
  }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  login() {
    if (!this.disable()) {
      // 'Minisha','Fin_ldap#26'
      //encrypt password
      let encPassword: string = "";
      const subdomain = window.location.hostname.split('.')[0];
      const newHostname = 'finsurge.tech'; 
      const authority = subdomain + '.' + newHostname;
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
          this.userName,
          encPassword,
          this.rememberMe,
          authority
        )
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.log(err);
            if(err.error['text']){
            this.errorMsg = err.error['text'];
            }
            else if(err['error']!==undefined && err['error']!==null){
              this.errorMsg=err['error'];
            }
            else{
              this.errorMsg='Please Refer the console'
            }
          }
        );
    }
  }

  disable() {
    if (this.userName.length == 0 || this.password.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  myFunction() {
    this.hide = !this.hide;
  }

  // convert into smallcase
  onInputChange() {
    this.userName = this.userName.toLowerCase();
  }
}
export class RadarItems {
  public column?: string;
  public value?: string;
}

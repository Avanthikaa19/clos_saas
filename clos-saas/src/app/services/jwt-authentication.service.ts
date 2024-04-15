import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../admin/components/users/models/User';
import { AccessControlData, AccessEncryptItems } from '../app.access';
import { ConfigurationService } from './configuration.service';
import { EncryptDecryptService } from './encrypt-decrypt.service';

export const TOKEN = 'token'
//To avoid copy user
export const AUTHENTICATED_USER = 'valueCheck'
export const USER_PROFILE = 'userProfile';
export const AC = 'AC';
@Injectable({
  providedIn: 'root'
})
export class JwtAuthenticationService {

  loggingIn: boolean = false;
  userProfile: User;
  apiErrorMessage: string = '';  
  formatAccessItem:AccessEncryptItems=new AccessEncryptItems()

  private window: Window | null;

  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
    public ac: AccessControlData, private router: Router, public encryptDecryptService: EncryptDecryptService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.window = this.document.defaultView;
    this.getUserProfile();
  }

  executeJWTAuthenticationService(username: string, password: string, remember: boolean,authority) {
    this.loggingIn = true;
    const headers = new HttpHeaders({
      'authority': authority
    });
    return this.http.post<any>(`${this.configurationService.apiUrl().services.auth_service}/auth/login`, { username, password },{headers}).pipe(
      map(
        data => {
          this.formatAccessItem.loginUser=username;
          let encryptUser = this.encryptDecryptService.encryptData(username)
          if (remember) {
            localStorage.setItem(AUTHENTICATED_USER, username);
            localStorage.setItem(TOKEN, `Bearer ${data.token}`);
            sessionStorage.setItem(AUTHENTICATED_USER, encryptUser);
            sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          } else {
            localStorage.removeItem(AUTHENTICATED_USER);
            localStorage.removeItem(TOKEN);
            sessionStorage.setItem(AUTHENTICATED_USER, encryptUser);
            sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          }
          this.router.navigate(['general/home']);
          this.getUserAccessProfileData();
          this.loggingIn = false;
        }
      )
    )
  }

  getAuthenticatedUser() {
    if (!sessionStorage.getItem(AUTHENTICATED_USER)) {
      if (localStorage.getItem(AUTHENTICATED_USER)) {
        sessionStorage.setItem(AUTHENTICATED_USER, localStorage.getItem(AUTHENTICATED_USER));
        sessionStorage.setItem(TOKEN, localStorage.getItem(TOKEN));
      }
    }
    return sessionStorage.getItem(AUTHENTICATED_USER);
  }

  getAuthenticatedToken() {
    if (this.getAuthenticatedUser()) {
      return sessionStorage.getItem(TOKEN);
    }
    return null;
  }

  isUserLoggedIn() {
    if (!sessionStorage.getItem(AUTHENTICATED_USER)) {
      if (localStorage.getItem(AUTHENTICATED_USER)) {
        sessionStorage.setItem(AUTHENTICATED_USER, localStorage.getItem(AUTHENTICATED_USER));
        sessionStorage.setItem(TOKEN, localStorage.getItem(TOKEN));
      }
    }
    let user = sessionStorage.getItem(AUTHENTICATED_USER);
    return !(user === null);
  }

  logout() {
    return this.http.post<any>(`${this.configurationService.apiUrl().services.auth_service}/auth/logout`, {});
  }

  clearSessionLoginData() {
    sessionStorage.removeItem(AUTHENTICATED_USER);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(USER_PROFILE);
    sessionStorage.removeItem("AC_SUPER");
    sessionStorage.removeItem("AC");
    sessionStorage.removeItem('LOAN_PROCESS')
    localStorage.removeItem(AUTHENTICATED_USER);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_PROFILE);
  }

  async getUserAccessProfileData() {
    this.apiErrorMessage = '';
    await this.configurationService.getUserAccessProfile().toPromise()
      .then(
        (res: User) => {
          this.userProfile = res;
          let encryptUserProfile=this.encryptDecryptService.encryptData(JSON.stringify(this.userProfile))
          sessionStorage.setItem(USER_PROFILE, encryptUserProfile);
          this.ac.items = {};
          if (res.roles?.length) {
            for (let role of res.roles) {
              if (role.name === 'SUPER') {
                console.log("USER IS SUPERUSER");
                this.ac.super = true;
              } else {
                this.ac.super = false;
              }
              if (role.defaultAccessTemplate?.length) {
                for (let accessTemplate of role.defaultAccessTemplate) {
                  if (accessTemplate?.accessibleItems) {
                    for (let accessibleItem of accessTemplate.accessibleItems) {
                      Object.defineProperty(
                        this.ac.items, accessibleItem, {
                        value: true,
                        writable: false,
                        enumerable: true,
                        configurable: false
                      }
                      );
                    }
                  }
                }
              }
            }
            if (this.ac.items) {
              if (this.ac?.items.LOAN_ORIGINATION_MODULE || this.ac?.super) {
                this.router.navigate(['general/home']);
              }
              else
                if (this.ac?.items.LOAN_ORIGINATION_MODULE || this.ac?.super) {
                this.router.navigate(['loan-org']);
                if (this.ac?.items.LOAN_ORIGINATION_DASHBOARD || this.ac?.super) {
                  this.router.navigate(['loan-org', 'loan', 'dashboard']);
                } else if (this.ac?.items.CREATE_APPS || this.ac?.super) {
                  this.router.navigate(['loan-org','loan' ,'main-app-list']);
                }
              } 
              else
              // if (this.ac?.items.ALERT_MODULE || this.ac?.super) {
              //   this.router.navigate(['alerts']);
              //   if (this.ac?.items.AL001D_DASHBOARD_HAS_ACCESS || this.ac?.super) {
              //     this.router.navigate(['alerts', 'dashboard']);
              //   } else if (this.ac?.items.AL002C_ALERTS_HAS_ACCESS || this.ac?.super) {
              //     this.router.navigate(['alerts', 'list']);
              //   } else if (this.ac?.items.AL008D_ALERTS_TRADES_INFO_HAS_ACCESS || this.ac?.super) {
              //     this.router.navigate(['alerts', 'trades-info']);
              //   } else if (this.ac?.items.AL012G_ALERTS_ASSESSMENT_TEMPLATE_HAS_ACCESS || this.ac?.super) {
              //     this.router.navigate(['alerts', 'assessment-templates']);
              //   } else if (this.ac?.items.AL006G_ALERTS_SCENARIO_HAS_ACCESS || this.ac?.super) {
              //     this.router.navigate(['alerts', 'scenario']);
              //   }
              // } 
              // else
               if (this.ac?.items.ADMIN_MODULE || this.ac?.super) {
                this.router.navigate(['admin']);
                if (this.ac?.items.AD001C_DASHBOARD_HAS_ACCESS || this.ac?.super) {
                  this.router.navigate(['admin', 'admin', 'dashboard']);
                }  else if (this.ac?.items.AD002G_USERS_HAS_ACCESS || this.ac?.super) {
                  this.router.navigate(['admin', 'admin', 'users']);
                } else if (this.ac?.items.AD004G_ROLES_HAS_ACCESS || this.ac?.super) {
                  this.router.navigate(['admin', 'admin', 'roles']);
                } else if (this.ac?.items.AD005G_ACCESS_TEMPLATE_HAS_ACCESS || this.ac?.super) {
                  this.router.navigate(['admin', 'admin', 'access-template']);
                } else if (this.ac?.items.AD006E_ITAM_REPORTS || this.ac?.super) {
                  this.router.navigate(['admin', 'admin', 'audit-reports']);
                }
              } else if (this.ac?.items.DFM000_MODULE || this.ac?.super) {
                this.router.navigate(['flows']);
              } else if (this.ac?.items.REPORT_PORTAL_MODULE || this.ac?.super) {
                this.router.navigate(['reports']);
              }else {
                this.router.navigate(['no-access'])
              }
            }
          }
          if(this.ac.super){
          let encryptSuper = this.encryptDecryptService.encryptData('TsSupERUserValId')
          sessionStorage.setItem("AC_SUPER", encryptSuper);
          }
          else{
          let enncryptSuper = this.encryptDecryptService.encryptData(this.ac.super.toString())
            sessionStorage.setItem("AC_SUPER", enncryptSuper);
          }
          this.formatAccessItem.accessItems=this.ac.items;
          let enncryptAc = this.encryptDecryptService.encryptData(JSON.stringify(this.formatAccessItem))
          sessionStorage.setItem("AC", enncryptAc);
        }
      )
      .catch((err) => {
        console.error(err.error);
        if (err.status == '403') {
          this.apiErrorMessage = 'Not authorized.';
        } else if (err.status == 0) {
          this.apiErrorMessage = 'Services are unreachable.';
        } else if (err.status == 500) {
          this.apiErrorMessage = 'There was a problem with the service.';
        }
        sessionStorage.removeItem(USER_PROFILE);
      });
  }

  getUserProfile() :any{
    if (this.userProfile) {
      return this.userProfile;
    } 
    else if (!this.userProfile && sessionStorage.getItem(USER_PROFILE)) {
      // this.userProfile = JSON.parse(sessionStorage.getItem(USER_PROFILE));
      if (sessionStorage.getItem("AC_SUPER")) {
        this.ac.super = sessionStorage.getItem("AC_SUPER") === 'true';
      }
      if (sessionStorage.getItem("AC")) {
        // this.ac.items = JSON.parse(sessionStorage.getItem("AC"));
      }
      // return this.getUserProfile(); // GOT  STACK OVERSIZE ERROR
    } else {
      return null;
    }
  }
}

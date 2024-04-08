import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { UrlService } from './url-service';
import { EncryptDecryptService } from './encrpt-decrypt-service';

export const TOKEN = 'token';
export const AUTHENTICATED_USER = 'authenticatedUser';

@Injectable({
  providedIn: 'root'
})


export class JwtAuthenticationService {

  loading: boolean = false;
  UserDetails: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private configurationService : UrlService,
    public encryptDecryptService:EncryptDecryptService,
  ) { }


  // To authenticate the login credentials
  executeJWTAuthenticationService(username: string, password: string, remember: boolean, authority: string) {
    // Set headers with authority
    const headers = new HttpHeaders({
      'authority': authority
    });
  
    return this.http.post<any>(`${this.configurationService.apiUrl().services.auth_service}/auth/login`, { username, password }, { headers }).pipe(
      map(
        data => {
          let encryptUser = this.encryptDecryptService.encryptData(username);
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
          this.router.navigate(['main']);
        }
      )
    );
  }
    // Method to get Authenticated token
    getAuthenticatedToken() {
        return sessionStorage.getItem(TOKEN);
    }
    //Method to get Authenticated User
    getAuthenticatedUser(){
      return sessionStorage.getItem(AUTHENTICATED_USER)
    }

  // Method to clear the session storage 
  clearSessionLoginData() {
    sessionStorage.clear();
    sessionStorage.removeItem(AUTHENTICATED_USER);
    sessionStorage.removeItem(TOKEN);
    localStorage.removeItem(AUTHENTICATED_USER);
    localStorage.removeItem(TOKEN);
  }

   // To logout the application
   logout() {
    return this.http.post<any>(`${this.configurationService.apiUrl().services.auth_service}/auth/logout`, null);
  }
}

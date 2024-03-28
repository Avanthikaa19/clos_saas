import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { UrlService } from './url-service';

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
    private configurationService : UrlService
  ) { }


  // To authenticate the login credentials
  executeJWTAuthenticationService(username, password, remember, connectionTimeout: number) {
    return this.http.post<any>(`${this.configurationService.apiUrl().services.auth_service}/auth/login`, { username, password }).pipe(map(
      data => {
        this.UserDetails = data.ldapName;
        if (remember) {
          localStorage.setItem(TOKEN, `Bearer ${data.token}`);
          localStorage.setItem(AUTHENTICATED_USER, username);
          sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          sessionStorage.setItem(AUTHENTICATED_USER, username);
        } else {
          localStorage.removeItem(TOKEN);
          sessionStorage.setItem(TOKEN, `Bearer ${data.token}`);
          sessionStorage.setItem(AUTHENTICATED_USER, username);
        }
        this.router.navigate(['/report'])

        return data;

      }
    ),
      timeout(connectionTimeout),
      catchError(err => {
        if (err.error == 'Username and Password Mismatched') {
          // this.getTracked('LOGIN', 'LOGIN', err.error)
        }
        return throwError(err);
      })
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

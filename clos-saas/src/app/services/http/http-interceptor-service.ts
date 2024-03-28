import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { JwtAuthenticationService } from '../jwt-authentication-service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(
    private authenticationService: JwtAuthenticationService,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let authHeaderString = this.authenticationService.getAuthenticatedToken();
    if (authHeaderString) {
      request = request.clone({
        setHeaders: {
          Authorization: authHeaderString
        }
      })
    }
    return next.handle(request);

  }

}

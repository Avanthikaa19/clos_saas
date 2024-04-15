import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SessionLogoutComponent } from '../general/components/session-logout/session-logout.component';
import { JwtAuthenticationService } from './jwt-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  dialogRef: any;

  constructor(
    private authenticationService: JwtAuthenticationService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authHeaderString = this.authenticationService.getAuthenticatedToken();
    let username = this.authenticationService.getAuthenticatedUser();
    let authorityString = window.location.host.replace('localhost:4200', 'finsurge.tech');
    // console.log("authHeaderString",authHeaderString)
    // console.log("username",username)
    if(authHeaderString && username){
      request = request.clone({
        setHeaders: { 
          Authorization: authHeaderString,
          authority:authorityString,
        }
      })
    }
    return next.handle(request);
  }

  
  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>>  {
  //   let authHeaderString = this.authenticationService.getAuthenticatedToken();
  //   let username = this.authenticationService.getAuthenticatedUser()
  //   if (authHeaderString && username) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: authHeaderString
  //       }
  //     })
  //   }
  //   return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
  //     if (event instanceof HttpResponse) {
  //       // do stuff with response if you want
  //     }
  //   }, (err: any) => {
  //     if (err instanceof HttpErrorResponse) {
  //       if (err.status === 406) {
  //         // this.dialog.closeAll();
  //         if (this.authenticationService.isUserLoggedIn() == true) {
  //           // this.dialog.closeAll();
  //           this.router.navigate(['logout']);
  //           this.authenticationService.logout();
  //           if (!this.dialogRef) {
  //             this.dialogRef = this.dialog.open(SessionLogoutComponent, {
  //               data: {
  //                 reason: "This session has expired.",
  //                 type: 'force_out'
  //               },
  //               disableClose: true
  //             });
  //             for (let dialoge of this.dialog.openDialogs) {
  //               console.log(dialoge);
  //               console.log('Loop Wrkng Fine')
  //               if (dialoge.id !== this.dialogRef.id) {
  //                 this.dialog.getDialogById(dialoge.id).close()
  //                 console.log('If Part')
  //               }
  //               else if (dialoge.id == this.dialogRef.id) {
  //                 console.log('Else Part')
  //               }
  //             }
  //             console.log('Dialog :', this.dialog.openDialogs)
  //             this.dialogRef.afterClosed().subscribe(result => {
  //               this.dialogRef = null;
  //             });
  //           }
  //         }
  //       }
  //     }
  //   }));
  // }
}

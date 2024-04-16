import { Component } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { slideInAnimation } from "./app.animations";
import { JwtAuthenticationService } from './services/jwt-authentication.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { SessionLogoutComponent } from './general/components/session-logout/session-logout.component';
import { AgDialog } from 'ag-grid-community';
// import { LogoutPopupComponent } from './general/components/logout-popup/logout-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from './services/configuration.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation]
})
export class AppComponent {
  title = 'los-gui';
  dialogRef: any;
  // url: any;


  constructor(
    private router: Router,
    private bnIdle: BnNgIdleService,
    private authenticationService: JwtAuthenticationService,
    public dialog: MatDialog,
    public url:ConfigurationService
  ) { }

  public updateUrl(): Promise<Object> {
    return this.url.getUrl().toPromise();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['routeAnimations'];
  }
  LOGIN

  async ngOnInit(): Promise<void> {
    //60 = 1 minute
    // if(this.authenticationService.logoutpopup==true){
      this.bnIdle.startWatching(900).subscribe((res) => {
        const token=sessionStorage.getItem("token")
        console.log('token',token)
      if (res && token) {
        console.log("logout")
        // setTimeout(wait, 10);
        // this.dialog.open(LogoutPopupComponent,{
        //   width: '250px',
        //   height:'250px',
        //   disableClose:true
        // });
        console.log('session expired');
        this.dialog.closeAll();
        this.router.navigate(['/signup/login'])
        alert("Session Expired!!!....")
      }
    });
    // let config = JSON.parse((await this.url.getConfigurations().toPromise()).toString());
    // this.setSessionTimeOut(config);
  }

  // setSessionTimeOut(config: any) {
  //   let idleTimeoutSeconds = 7200;
  //   if(config != undefined && config != null) {
  //     if(config.idleTimeoutSeconds != undefined && config.idleTimeoutSeconds != undefined) {
  //       idleTimeoutSeconds = config.idleTimeoutSeconds;
  //     }
  //   }
  //   this.bnIdle.startWatching(idleTimeoutSeconds).subscribe(() => {
  //     // this.dialog.closeAll();
  //     if (this.authenticationService.isUserLoggedIn() == true) {
  //       this.router.navigate(['logout']);
  //       this.authenticationService.logout();
  //       if(!this.dialogRef) {
  //         // this.dialog.closeAll();
  //         this.dialogRef = this.dialog.open(SessionLogoutComponent, {
  //           data : {
  //             reason: 'You have been idle for too long.',
  //             type: 'idle'
  //           }
  //         });
  //         console.log('Dialog :',this.dialog.openDialogs);
  //         // console.log('Dialog Ref :', this.dialogRef.id);
  //         for(let dialoge of this.dialog.openDialogs){
  //           console.log(dialoge);
  //           console.log('Loop Wrkng Fine')
  //           if(dialoge.id !== this.dialogRef.id){
  //             this.dialog.getDialogById(dialoge.id).close()
  //             console.log('If Part')
  //           }
  //           else if(dialoge.id == this.dialogRef.id){
  //             console.log('Else Part')
  //           }
  //         }
  //         console.log('Dialog :',this.dialog.openDialogs)
  //         this.dialogRef.afterClosed().subscribe(result => {
  //           this.dialogRef = null;
  //         });
  //       }
  //     }
  //   })
  // }

  userIsLloggedIn(): boolean {
    return this.authenticationService.isUserLoggedIn();
  }

  // const dialog = this.dialog.open(LogoutPopupComponent, {
  //   height: '85vh',
  //   width: '55vw',
  // })
}



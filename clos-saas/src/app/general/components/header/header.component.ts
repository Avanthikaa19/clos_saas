import { useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { AccessControlData } from 'src/app/app.access';
import { fadeInOut } from 'src/app/app.animations';
import { Notifications } from 'src/app/models/NotificationModel';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { AUTHENTICATED_USER, JwtAuthenticationService } from 'src/app/services/jwt-authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutPopupComponent } from '../logout-popup/logout-popup.component';
import { PageData } from '../generic-data-table/generic-data-table.component';
import { ServiceService } from 'src/app/loan-origination/service.service';
import { SaasService } from 'src/app/saas/saas-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeInOut]
})
export class HeaderComponent implements OnInit {

  notifiactionsOpen: boolean = false;
  fontsize: number[] = [6, 7, 8, 9, 10, 11, 12, 14, 18, 24, 36];
  selectedFont: number = 14;
  autoSubscription: Subscription;
  notificationCount: number = 0;
  pageData: PageData;
  notifications: Notifications[] = [];
  status: string = "";
  closeNotification: string = "";
  token: any;
  currentUser: any;
  flow;
  report;
  loan;
  manage;
  admin;
  alert;
  contactNo:any='';
  contactMail:any='';

  constructor(    
    public dialog: MatDialog,
    public authenticationService: JwtAuthenticationService,
    private snackBar: MatSnackBar,
    public ac: AccessControlData,
    private router: Router,
    public encryptDecryptService:EncryptDecryptService,
    private notificationService: NotificationService,
    public saasService:SaasService,
  ) {
    this.ac.items=this.encryptDecryptService.getACItemsFromSession()
    this.ac.super=this.encryptDecryptService.getACSuperFromSession()

    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.currentUser=encryptDecryptService.decryptData(user)
    this.token = sessionStorage.getItem('token')
    // this.fontsize = ['6', '7', '8', '9','10','11','12','14','18','24','36'];
    console.log('token', this.token);
    this.getAutoSubscription();
    this.pageData = new PageData();
    this.pageData.pageSize = 10;
    this.pageData.currentPage = 1;
    this.pageData.totalPages = 1;
    this.pageData.totalRecords = 0;

  }
 
  ngOnInit(): void {
    this.getAutoSubscription();
    this.getContactInfo();
  }

  ngOnDestroy() {
    this.autoSubscription.unsubscribe();
  }
 getCurrentUser():string{
  if(sessionStorage.getItem(AUTHENTICATED_USER)){
  let user=sessionStorage.getItem(AUTHENTICATED_USER)
  this.currentUser=this.encryptDecryptService.decryptData(user)}
  return this.currentUser
 }
  userIsLloggedIn(): boolean {
    return this.authenticationService.isUserLoggedIn();
  }

  copyTokenToClipboard() {
    let token = sessionStorage.getItem('token');
    if (token) {
      //create temporary element
      var copyElement = document.createElement("textarea");
      copyElement.style.position = 'fixed';
      copyElement.style.opacity = '0';
      //set the string
      copyElement.textContent = token;
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(copyElement);
      //select it
      copyElement.select();
      //execute copy command
      document.execCommand('copy');
      //remove temporary element
      body.removeChild(copyElement);
      this.openSnackBar('Token copied to clipboard.', '');
      return;
    }
    this.openSnackBar('No token to copy.', '');
  }


  //open snack bar
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  changeFontSize() {
    document.getElementsByTagName("body")[0].style.fontSize = this.selectedFont + 'px';
    document.getElementsByTagName("html")[0].style.fontSize = this.selectedFont + 'px';
    document.getElementsByTagName("input")[0].style.fontSize = this.selectedFont + 'px';
  }

  getUnreadNotification() {
    // this.notificationService.getUnreadNotificationCount(this.currentUser).subscribe(
    //   (res) => {

    //     this.notificationCount = res;
    //   },
    //   (err) => {
    //     console.log(err);
    //   },

    // )

  }

  getAutoSubscription() {
    this.autoSubscription = interval(5000).subscribe((x => {
      if (this.userIsLloggedIn()) {
        this.getUnreadNotification();
      }
      else {
        this.autoSubscription.unsubscribe();
      }
    }));

  }

  getAllandUnreadData(pageData: PageData, status?: string) {
    console.log('Getting Status', status);
    if (status || status == '') {
      this.status = status;
      console.log('If conditin triggred');
    }
    console.log('Status', this.status);
    this.notificationService.getAllandUnreadNotification(this.status, this.currentUser, pageData.currentPage, pageData.pageSize).subscribe(
      (res) => {
        this.notifications = res.data;
        this.pageData.totalRecords = res.count;
        this.pageData.totalPages = res.totalPages;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  onScroll(event: any) {
    // visible height + pixel scrolled >= total height 
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {  //TO DETECT SCROLLBAR REACHED BOTTOM OF DIV
      if (this.pageData.currentPage >= this.pageData.totalPages) {
        //do nothing
      } else {
        this.pageData.pageSize = this.pageData.pageSize + 5; //INCREASE PAGESIZE IF SCROLLBAR REACHED BOTTOM
        this.getAllandUnreadData(this.pageData);
      }
      console.log(this.pageData.pageSize)
    } else if (event.target.scrollTop == 0) { //TO DETECT SCROLLBAR REACHED TOP OF DIV
      //USE IT IF NECESSARY
      this.pageData.currentPage = 1;
      this.pageData.pageSize = 10;
    } else { // DEFAULT BEHAVIOUR
      //do nothing
    }
  }

  setMarkAsReadNotification(id) {
    this.notificationService.setMarkAsRead(id, null).subscribe(
      (res) => {
        console.log(res, 'Marked as read');
        this.getAllandUnreadData(this.pageData);
        this.getUnreadNotification();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  setCloseNotification(id) {
    this.notificationService.setCloseFlag(id, null).subscribe(
      (res) => {
        console.log(res, 'Closed Bug');
        this.getAllandUnreadData(this.pageData);
        this.getUnreadNotification();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  unSubscribeNotification() {
    this.autoSubscription.unsubscribe();
  }

  setMarkAllasRead() {
    this.notificationService.setMarkAllAsRead(this.currentUser).subscribe(
      (res) => {
        this.getAllandUnreadData(this.pageData);
        this.getUnreadNotification();
      },
      (err) => {
        console.log(err);
      }
    )
  }
  setAdminRouter() {
    if (this.ac?.items.ADMIN_MODULE || this.ac?.super) {
      this.router.navigate(['admin']);
      if (this.ac?.items.AD001C_DASHBOARD_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['admin', 'admin', 'dashboard']);
      } else if (this.ac?.items.AD002G_USERS_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['admin', 'admin', 'users']);
      } else if (this.ac?.items.AD004G_ROLES_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['admin', 'admin', 'roles']);
      } else if (this.ac?.items.AD005G_ACCESS_TEMPLATE_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['admin', 'admin', 'access-template']);
      } else if (this.ac?.items.AD006E_ITAM_REPORTS || this.ac?.super) {
        this.router.navigate(['admin', 'admin', 'audit-reports']);
      }
    }
  }

  setLoanOrgRouter(){
    if (this.ac?.items.LOAN_ORIGINATION_MODULE || this.ac?.super) {
      this.router.navigate(['loan-org']);
      if (this.ac?.items.LOAN_ORIGINATION_DASHBOARD || this.ac?.super) {
        this.router.navigate(['loan-org', 'loan', 'dashboard']);
      } else if (this.ac?.items.CREATE_APPS || this.ac?.super) {
        this.router.navigate(['loan-org','loan' ,'main-app-list']);
      }
    } 
  }
  
  setAlertRouter() {
    if (this.ac?.items.ALERT_MODULE || this.ac?.super) {
      this.router.navigate(['alerts']);
      if (this.ac?.items.AL001D_DASHBOARD_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['alerts', 'dashboard']);
      } else if (this.ac?.items.AL002C_ALERTS_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['alerts', 'list']);
      } else if (this.ac?.items.AL008D_ALERTS_TRADES_INFO_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['alerts', 'trades-info']);
      } else if (this.ac?.items.AL012G_ALERTS_ASSESSMENT_TEMPLATE_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['alerts', 'assessment-templates']);
      } else if (this.ac?.items.AL006G_ALERTS_SCENARIO_HAS_ACCESS || this.ac?.super) {
        this.router.navigate(['alerts', 'scenario']);
      }
    }
  }

  onGoBackClick(){
    this.router.navigate(['home']);
    sessionStorage.removeItem('appId');
    sessionStorage.removeItem('duplicateID');
    sessionStorage.removeItem('scorecardId');
    sessionStorage.removeItem('TabIndex');
  }

  setRouteFlow(){
    console.log(this.router.url)
    this.flow = this.router.url
  }

  setRouteReports() {
    console.log(this.router.url)
    this.report = this.router.url
  }

  setRouteLoan() {
    console.log(this.router.url)
    this.loan = this.router.url
  }
  setRouteManage() {
    console.log(this.router.url)
    this.manage = this.router.url
  }
  setRouteAdmin() {
    console.log(this.router.url)
    this.admin = this.router.url
  }
  setRouteAlert() {
    console.log(this.router.url)
    this.alert = this.router.url
  }

// logout popup
  logoutPopup() {
    const dialogRef = this.dialog.open(LogoutPopupComponent, {
     width: '40rem',
     height: '20rem',
     panelClass:'logPopup'
    });
  }


  //C-CLOS Function

  onHomeBtnClick(){
    this.router.navigate(['/general/home']);
    sessionStorage.removeItem('appId')
  }
  getContactInfo(){
    this.saasService.getContactInfo().subscribe(
      res=>{
        console.log(res)
        this.contactNo = res['data'].supportMobile;
        this.contactMail = res['data'].supportMail;
      }
    )
  }
}

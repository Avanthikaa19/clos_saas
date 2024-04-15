import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { CrmServiceService } from 'src/app/crm-module/crm-service.service';
import { UrlService } from 'src/app/decision-engine/services/http/url.service';
import { SnackbarComponent } from 'src/app/dynamic-dashboard/snackbar';
import { CustomiseDashboard } from '../../models/model';
import { CustomServiceService } from '../../service/custom-service.service';
import { Router } from '@angular/router';
import { AUTHENTICATED_USER } from 'src/app/services/jwt-authentication.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';

@Component({
  selector: 'app-template-mapping',
  templateUrl: './template-mapping.component.html',
  styleUrls: ['./template-mapping.component.scss']
})
export class TemplateMappingComponent implements OnInit {

  allUsersList: string[]=[];
  dashBoardMapping: CustomiseDashboard = new CustomiseDashboard();
  saveLoading: boolean=false;
  assignedUser: string = '';
  timer:any = null;
  isPrimary: boolean = false;
  primary: any[]=[];
  secondary: any[]=[];
  getUserName:any;
  defaultDashboard:boolean=false;
  homeId:any;
  tempId:any;

  constructor(
    public dialogRef: MatDialogRef<TemplateMappingComponent>,
    public customService: CustomServiceService,
    private url: UrlService,
    public router: Router,
    // public crmService: CrmServiceService,
    private snackBar: MatSnackBar,
    public encryptDecryptService:EncryptDecryptService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.dashBoardMapping.id = this.data.id;
    this.dashBoardMapping.dashboardName = this.data.dashboardName;
    // this.dashBoardMapping.secondaryUsers = [];
    let user=sessionStorage.getItem(AUTHENTICATED_USER)
    this.getUserName=encryptDecryptService.decryptData(user);
    this.getMappingDetails();
  }

  public updateUrl(): Promise < any > {
    return this.url.getUrl().toPromise();
  }

  async ngOnInit() {
    this.selectedId=sessionStorage.getItem('selectedId')
    let response = await this.updateUrl();
    UrlService.API_URL = response.toString();
    if (UrlService.API_URL.trim().length == 0) {
      console.warn('FALLING BACK TO ALTERNATE API URL.');
      UrlService.API_URL = UrlService.FALLBACK_API_URL;
    }
    this.homeId=sessionStorage.getItem('homeId')
    this.tempId=sessionStorage.getItem('tempId')
    if(this.tempId===this.dashBoardMapping.id?.toString()){
      this.defaultDashboard=true
    }
    this.getAllUser();
  }

  // All Users
  getAllUser(){
    this.saveLoading= true;
    this.customService.getAllUsers().subscribe(
      (res:any)=>{
        this.allUsersList = res['data']; 
        this.saveLoading= false;
      }
    )
  }

  secondaryValue(event:any){
    this.secondary.push(event);
  }

  primaryValue(event:any){
    this.primary.push(event);
  }

  onKeyup(){
    clearTimeout(this.timer); 
    // this.timer = setTimeout(() =>{this.getAllUser()}, 1000)
  }

   // Create New Template
   createMapping(){
    this.saveLoading = true;
    this.customService.createTemplate(this.dashBoardMapping).subscribe(
     (res:any) =>{
        this.assigningData(res);
        this.saveLoading = false;
        this.openSnackBar(res['status'],'')
      },err =>{
        this.saveLoading = false;
        this.openErrSnackbar(err);
      }
    )
  }
  //Update New Template
  updateMapping(){
    //  if( this.dashBoardMapping.selectedScreen?.includes('Application_Entry')){
    //     if(this.dashBoardMapping?.dynamicDashboardUsers?.includes(this.getUserName)){
    //       // console.log('User Exists')
    //     }
    //     else{
    //       this.dashBoardMapping?.dynamicDashboardUsers?.push(this.getUserName)
    //     }
    //   }
    this.customService.updateTemplate(this.dashBoardMapping.id, this.dashBoardMapping).subscribe(
      (res:any) =>{
        this.assigningData(res);
        this.openSnackBar(res['status'],'')
      },err =>{
        this.saveLoading = false;
        this.openErrSnackbar(err);
      }
    )
  }
  selectedId:any;
  updateTemp:boolean=false;
  assigningData(res:any){
    if(this.updateTemp==true){
      this.defaultDashboard=true
    }
    else{
      this.defaultDashboard=false
    }
    this.dashBoardMapping = res["data"];
    this.dashBoardMapping.widget.map((item) => {
      item.actualData = JSON.parse(item.data);
    });
    if(this.defaultDashboard==true){
      this.selectedId= this.dashBoardMapping.id
      sessionStorage.setItem('selectedId',this.selectedId)
    this.dashBoardMapping?.selectedScreen?.push('Application_Entry')
    this.customService.homepage(this.dashBoardMapping.id).subscribe(
      (res:any)=>{
      }
    )
    // console.log(this.dashBoardMapping.selectedScreen)
    // this.dashBoardMapping?.dynamicDashboardUsers?.push(this.getUserName)
    sessionStorage.setItem("grid-layout", JSON.stringify(this.dashBoardMapping));
    this.router.navigate(['/application-entry/application-view']);
    }
  }
  setToHome(def:boolean){
    this.updateTemp=def;
    sessionStorage.removeItem('homeId')
    sessionStorage.removeItem('this.userKey')
    console.log(this.getUserName)
    // if(this.defaultDashboard==true){
    //     if(this.dashBoardMapping?.dynamicDashboardUsers?.includes(this.getUserName)){
    //       // console.log('User Exists')
    //     }
    //     else{
    //       this.dashBoardMapping?.dynamicDashboardUsers?.push(this.getUserName)
    //     }
    // }
    this.defaultDashboard=!this.defaultDashboard
    if (def === false){
      sessionStorage.removeItem("grid-layout");
      sessionStorage.removeItem('selectedId')
      sessionStorage.removeItem('homeId')
      sessionStorage.removeItem('this.userKey')
      this.dashBoardMapping.dynamicDashboardUsers.splice(this.getUserName)
    }
  }
  Saving(){
    if(this.dashBoardMapping.id){
      this.updateMapping();
    }else{
      this.createMapping();
    }
    this.dialogRef.close();
  }

  getMappingDetails(){
    this.customService.getTemplateWithId(this.dashBoardMapping.id).subscribe(
      res =>{
        if(res){
          this.dashBoardMapping = res;
        }
      }
    );
  }

    //open snack bar
    openSnackBar(message: string, action: string) {
      this.snackBar.openFromComponent(SnackbarComponent, {
        panelClass: ['success-snackbar'],duration: 5000,
        data: {
          message: message, icon: 'done',type:'success'
        }
      });
    }

    openErrSnackbar(message:string){
      this.snackBar.openFromComponent(SnackbarComponent, {
        panelClass: ['error-snackbar'],duration: 5000,
        data: {
          message: message, icon: 'error_outline',type:'error'
        }
      });
    }

    setUser(){
      // if(this.isPrimary == true){
      //   this.dashBoardMapping.primaryUsers = this.dashBoardMapping.secondaryUsers;
      //   this.dashBoardMapping.secondaryUsers = [];
      // }
      // else{
      //   this.dashBoardMapping.secondaryUsers = this.dashBoardMapping.primaryUsers;
      //   this.dashBoardMapping.primaryUsers= [];
      // }
    }


}
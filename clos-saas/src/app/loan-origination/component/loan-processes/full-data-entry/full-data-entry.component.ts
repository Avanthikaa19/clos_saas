import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { ServiceService } from 'src/app/loan-origination/service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ApplicantDetail, CollateralDetail, CompanyDetail, FullDataCapture } from '../model';
import { LoanServiceService } from '../service/loan-service.service';
import { CreateApplicantComponent } from './create-applicant/create-applicant.component';

@Component({
  selector: 'app-full-data-entry',
  templateUrl: './full-data-entry.component.html',
  styleUrls: ['./full-data-entry.component.scss', '../loan-processes.component.scss']
})
export class FullDataEntryComponent implements OnInit {

  date = new Date();
  selectedCategory = '1';
  SelectedTabIndex: number;
  showApplicant = 'true';
  cash: any;
  data: ApplicantDetail= new ApplicantDetail(null,'','',null,null,'',null,null,'',false);
  property: any;
  appId: number;
  applicants: ApplicantDetail[];
  applicant;
  collateralTypeChecklist: any[] = [
    { name: 'Property', checked: false },
    { name: 'Machinery', checked: false },
    { name: 'Cash', checked: false },
    { name: 'Inventory', checked: false },
    { name: 'Receivables', checked: false },
  ];
  loading: boolean = false;
  appID;
  loadingApplications: boolean = false;
  applicantDetails:ApplicantDetail = new ApplicantDetail(null,'','',null,null,'',null,null,'',false);
  headers = ['First Name','Last Name','Dob','Applicant Year In Business','Title/Position','OwnerShip','Bureau Search Consent','Email Id','Edit','Delete']

  @ViewChild('stepper', { read: MatStepper }) stepper: MatStepper;
  isChecked: any[]=[];

  constructor(public dateAdapter: DateAdapter<Date>,
    public notifierService: NotifierService,
    public dialog: MatDialog,
    public router: Router,
    public loanService: ServiceService,
    public ac: AccessControlData,
    public encryptDecryptService: EncryptDecryptService,
    public dataCaptureService: LoanServiceService
  ) {
    this.ac.items = this.encryptDecryptService.getACItemsFromSession()
    this.ac.super = this.encryptDecryptService.getACSuperFromSession();
    dateAdapter.setLocale("en-in");
  }

  async ngOnInit() {
    this.appID = sessionStorage.getItem('CURR_APPLICATION_ID');
    console.log(this.appID)
    if(sessionStorage.getItem('Tab')){
      this.SelectedTabIndex = 1;
      sessionStorage.removeItem('Tab');
    }
    await this.getSessionStorageAppId();
    await this.checksForExistingApplication();
  }

    /* Checks whether if the application new or existing one */
    checksForExistingApplication() {
      if (this.loanService.applicationObject.fullData == null) {
        let appID: any = sessionStorage.getItem('CURR_APPLICATION_ID');
        if (appID) {
          this.loading = true;
          let encryptAppID = this.encryptDecryptService.decryptData(appID) //CONVERT ENCRYPTED DATA INTO ORIGIAL DATA USING DECRYPT METHOD
          console.log(encryptAppID)
          this.dataCaptureService.getApplicationDataWithId(encryptAppID).subscribe(
            res => {
              this.loading = false;
              this.loanService.applicationObject = res;
              this.reassignCollateral();
            },
            err => {
              this.loading = false;
            }
          );
        }else{
          this.loanService.applicationObject.fullData = new FullDataCapture(new CompanyDetail(null, null, null, null, null, null, {
            "id": null,
            "unitNo": null,
            "streetAddress": null,
            "city": null,
            "district": null,
            "zipCode": null
          }),
            new ApplicantDetail(null,null, null, null, null, null, null, false, null,false),
            new CollateralDetail([], null, null, null, null, null, {
              "id": null,
              "unitNo": null,
              "streetAddress": null,
              "city": null,
              "district": null,
              "zipCode": null
            }));
        }
      } else {
        this.reassignCollateral();
      }
    }

          // Assign from data response to HTML variable
          reassignCollateral(){
                      this.loanService.applicationObject.fullData.collateralDetails?.collateralType?.forEach(item =>{
            this.collateralTypeChecklist.forEach((templist) =>{
              if(templist.name == item){
                templist.checked = true;
                this.getCollateralFields(templist.name,templist.checked);
              }
            })
          })
          }

  // Gets Application Id from session storage
  getSessionStorageAppId() {
    let appID: any = sessionStorage.getItem('CURR_APPLICATION_ID');
    console.log(appID)
    if (appID) {
      let encryptAppID = this.encryptDecryptService.decryptData(appID) //CONVERT ENCRYPTED DATA INTO ORIGIAL DATA USING DECRYPT METHOD
      this.appId = encryptAppID;
    }
  }

  /* Stores the Company's Full Data  */
  saveCompanyFullData() {
    if (!this.appId) {
      this.getSessionStorageAppId()
    }
    this.dataCaptureService.updateDataEntry(this.appId, this.loanService.applicationObject.fullData.companyDetails).subscribe(
      res => {
        this.notifierService.notify('info', 'Great! Your Company data has been successfully saved.');
        this.stepper.next();
      },
      err => {
        this.notifierService.notify('error', 'Unexpected Error! Failed to store data. ' + err.error);
      }
    )
  }

  /* Create the Company's Full Data  */
  createCompanyFullData() {
    if (!this.appId) {
      this.getSessionStorageAppId()
    }
    this.dataCaptureService.saveCompanyDetails(this.appId, this.loanService.applicationObject.fullData.companyDetails).subscribe(
      res => {
        this.notifierService.notify('info', 'Great! Your Company data has been successfully saved.');
        this.stepper.next();
      },
      err => {
        this.notifierService.notify('error', 'Unexpected Error! Failed to store data. ' + err.error);
      }
    )
  }

  /* Stores the Applicant's Full Data  */
  saveApplicantFullData() {
    this.dataCaptureService.updateDataEntry(this.appId, this.loanService.applicationObject.fullData.applicantDetails).subscribe(
      res => {
        this.notifierService.notify('info', 'Success! Your Applicant data has been saved.');
        this.stepper.next();
      },
      err => {
        this.notifierService.notify('error', 'Unexpected Error! Failed to store data. ' + err.error);
      }
    )
  }

  /* Create the Applicant's Full Data  */
  createApplicantFullData() {
  //   this.dataCaptureService.saveApplicantDetails(this.appId, this.loanService.applicationObject.fullData.applicantDetails).subscribe(
  //     res => {
  //       this.notifierService.notify('info', 'Success! Your Applicant data has been saved.');
        this.stepper.next();
  //     },
  //     err => {
  //       this.notifierService.notify('error', 'Unexpected Error! Failed to store data. ' + err.error);
  //     }
  //   )
  }

  /* Stores the Collateral's Full Data  
  */
  saveCollateralFullData() {
    this.loanService.applicationObject.fullData.collateralDetails.collateralType = [];
    // Sets the checked Collateral type with Collateral Json
    this.collateralTypeChecklist.forEach(item => {
      if (item.checked) {
        this.loanService.applicationObject.fullData.collateralDetails.collateralType.push(item.name); 
      }else{
        if(item.name == 'Property'){
          this.loanService.applicationObject.fullData.collateralDetails.propertyType = null;
          this.loanService.applicationObject.fullData.collateralDetails.collateralAddress ={
            "id": null,
            "unitNo": null,
            "streetAddress": null,
            "city": null,
            "district": null,
            "zipCode": null
          }
        }else if(item.name == 'Cash'){
          this.loanService.applicationObject.fullData.collateralDetails.currentBank = null;
          this.loanService.applicationObject.fullData.collateralDetails.depositAmount = null;
        }
      }
    });
    // Sets the application ID from session storage.
    if (!this.appId) {
      this.getSessionStorageAppId()
    }
    this.loanService.applicationObject.fullData.collateralDetails['fdc_status'] = 'Done';
    this.dataCaptureService.updateDataEntry(this.appId, this.loanService.applicationObject.fullData.collateralDetails).subscribe(
      res => {
        this.notifierService.notify('info', 'Success! Your Collateral data has been saved.');
        this.router.navigate(['/loan-org/loan/main-app-list/loan-processes/process/11']);
      },
      err => {
        this.notifierService.notify('error', 'Unexpected Error! Failed to store data. ' + err.error);
      }
    )
  }

  /* Create the Collateral's Full Data  
  */
  createCollateralFullData() {
    this.loanService.applicationObject.fullData.collateralDetails.collateralType = [];
    // Sets the checked Collateral type with Collateral Json
    this.collateralTypeChecklist.forEach(item => {
      if (item.checked) {
        this.loanService.applicationObject.fullData.collateralDetails.collateralType.push(item.name); 
      }else{
        if(item.name == 'Property'){
          this.loanService.applicationObject.fullData.collateralDetails.propertyType = null;
          this.loanService.applicationObject.fullData.collateralDetails.collateralAddress ={
            "id": null,
            "unitNo": null,
            "streetAddress": null,
            "city": null,
            "district": null,
            "zipCode": null
          }
        }else if(item.name == 'Cash'){
          this.loanService.applicationObject.fullData.collateralDetails.currentBank = null;
          this.loanService.applicationObject.fullData.collateralDetails.depositAmount = null;
        }
      }
    });
    // Sets the application ID from session storage.
    if (!this.appId) {
      this.getSessionStorageAppId()
    }
    this.loanService.applicationObject.fullData.collateralDetails['fdc_status'] = 'Done';
    this.dataCaptureService.saveCollateralDetails(this.appId, this.loanService.applicationObject.fullData.collateralDetails).subscribe(
      res => {
        this.notifierService.notify('info', 'Success! Your Collateral data has been saved.');
        this.router.navigate(['/loan-org/loan/main-app-list/loan-processes/process/11']);
      },
      err => {
        this.notifierService.notify('error', 'Unexpected Error! Failed to store data. ' + err.error);
      }
    )
  }

  // Displays required fields based on collateral type selection
  getCollateralFields(name, isChecked) {
    if(isChecked == true){
    this.isChecked.push(isChecked);
    }
    else{
      this.isChecked.pop();
    }
    if (name == 'Property'){
      this.property = isChecked;
    }
    else if (name == 'Cash')
      this.cash = isChecked;
    else
      return;
  }

  /*
 ** New Applicant Page Code - Temporarily Hidden
 ************************************************
 */
  // addNewApplicant(){
  //   const dialogRef = this.dialog.open(ApplicantDetailComponent, {
  //     width:'1550px'
  //   });
  // }

  //Getting value from child component
  // getValue(event){
  //   this.showApplicant = event;
  // }

  // Multiple Applicant
  getApplicant() {
    let appID: any = sessionStorage.getItem('CURR_APPLICATION_ID');
    if(appID){
      let encryptAppID = this.encryptDecryptService.decryptData(appID)
      this.loadingApplications = true;
      this.dataCaptureService.getApplicant(encryptAppID).subscribe(
        res => {
          this.loadingApplications = false;
          this.applicants = res;
        },err => {
          this.loadingApplications = false;
          console.log(err)
        }
      )
    }else{
      let ID: any = sessionStorage.getItem('AppId');
      this.loadingApplications = true;
      this.dataCaptureService.getApplicant(ID).subscribe(
        res => {
          this.loadingApplications = false;
          this.applicants = res;
        },err => {
          this.loadingApplications = false;
          console.log(err)
        }
      )
    }    
  }

  // Delete Applicant
  deleteApplicant(id) {
    this.dataCaptureService.deleteApplicant(id).subscribe(
      res => {
        console.log(res);
        this.getApplicant();
      },err => {
        console.log(err)
      }
    )
  }

  // Navigate to Create Applicant
  goToCreateEdit(data: ApplicantDetail){
    sessionStorage.setItem('appsData',JSON.stringify(data))
    sessionStorage.setItem('Tab','1');
    this.loanService.data = data;
    // this.router.navigate(['/loan-org/loan/main-app-list/loan-processes/process/2/create-apps']);
    this.openDialog();
    }

    openDialog() {
      const dialogRef = this.dialog.open(CreateApplicantComponent, {
        width: '40%'
    });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
        setTimeout(() => {
          this.getApplicant();
        },100);
      });
      this.router.events.subscribe(() => {
        dialogRef.close();
      });
    }


addressFeild:string;
    addressDisable(property:any){
       this.addressFeild=property;
    }
}

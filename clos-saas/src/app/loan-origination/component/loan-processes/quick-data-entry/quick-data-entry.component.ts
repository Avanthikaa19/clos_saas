import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { NotifierService } from 'angular-notifier';
import { AccessControlData } from 'src/app/app.access';
import { ServiceService } from 'src/app/loan-origination/service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { LoanServiceService } from '../service/loan-service.service';

@Component({
  selector: 'app-quick-data-entry',
  templateUrl: './quick-data-entry.component.html',
  styleUrls: ['./quick-data-entry.component.scss', '../loan-processes.component.scss']
})
export class QuickDataEntryComponent implements OnInit {

  date = new Date();
  value: number;
  checked: boolean = true;
  loanProcess: any[] = [];
  loanType: string;
  loading: boolean = false;
  loanPurpose: string[] = [];

  constructor(public dateAdapter: DateAdapter<Date>,
    public notifierService: NotifierService,
    public loanService: ServiceService,
    public ac: AccessControlData,
    public encryptDecryptService: EncryptDecryptService,
    public dataCaptureService: LoanServiceService,
    public datePipe: DatePipe
  ) {
    this.ac.items = this.encryptDecryptService.getACItemsFromSession()
    this.ac.super = this.encryptDecryptService.getACSuperFromSession();
    dateAdapter.setLocale("en-in");
  }

  ngOnInit(): void {

    // Setting as Default disabled
    this.loanService.applicationObject.initialData.companyName = '';
    this.loanService.applicationObject.initialData.companyType = '';
    this.loanService.applicationObject.initialData.secTDINo = '';
    this.loanService.applicationObject.initialData.applicantName = '';
    this.loanService.applicationObject.initialData.loanType = '';
    this.loanService.applicationObject.initialData.loanPurpose = '';
    // Checks if new or existing application and initials the data
    this.viewExistingApplication(); 
  }

  /* Fetches the captured data with ID */
  viewExistingApplication() {
    let appID: any = sessionStorage.getItem('CURR_APPLICATION_ID');
    if (appID) {
      this.loading = true;
      let encryptAppID = this.encryptDecryptService.decryptData(appID) //CONVERT ENCRYPTED DATA INTO ORIGIAL DATA USING DECRYPT METHOD
      this.dataCaptureService.getApplicationDataWithId(encryptAppID).subscribe(
        res => {
          this.loading = false;
          this.loanService.applicationObject = res;
          this.getLoanPurposeList(this.loanService.applicationObject.initialData.loanType);
        },
        err => {
          this.loading = false;
        }
      );
    }
  }

  /* Saves all the captured inital Data  */
  saveInitialData() {
    this.loanService.applicationObject.initialData.idc_status = 'Done';
    this.loanService.applicationObject.initialData.createdTime = this.datePipe.transform(this.loanService.applicationObject.initialData.createdTime,'yyyy/MM/dd hh:mm:ss')
    this.dataCaptureService.saveInitialDataEntry(this.loanService.applicationObject.initialData).subscribe(
      res => {
        this.loanService.applicationObject.initialData.id = res['id'];
        console.log(res['id'])
        let appID:any = this.loanService.applicationObject.initialData.id
        console.log(appID)
        sessionStorage.setItem('AppId',appID)
        if (appID) {
          let encryptAppID = this.encryptDecryptService.encryptData(appID) //CONVERT  ORIGIAL DATA INTO ENCRYPTED DATAUSING ENCRYPT METHOD
          console.log(encryptAppID)
          sessionStorage.setItem('CURR_APPLICATION_ID', encryptAppID)
          this.notifierService.notify('info', 'Great! Your initial data has been successfully saved.');
        }
      },
      err => {
        this.notifierService.notify('error', 'Unexpected Error! Failed to store data.');
      }
    );
  }

  // Displays the loan-purpose dropdown list from loan-type
  getLoanPurposeList(loanType: string){
    this.dataCaptureService.getLoanPurposeDropdown(loanType).subscribe(
      res =>{
        this.loanPurpose = res;
      },
      err =>{
        this.loanPurpose = [];
        this.notifierService.notify('error', 'Unexpected Error! Failed to load Loan-Purpose.');
      }
    )
  }
}

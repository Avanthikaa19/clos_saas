import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/loan-origination/service.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ApplicantDetail } from '../../model';
import { LoanServiceService } from '../../service/loan-service.service';

@Component({
  selector: 'app-create-applicant',
  templateUrl: './create-applicant.component.html',
  styleUrls: ['./create-applicant.component.scss']
})
export class CreateApplicantComponent implements OnInit {
  maxDate = new Date();
  data: ApplicantDetail= new ApplicantDetail(null,'','',null,null,'',null,false,'',false);
  applicant: String[] = [];
  
  constructor(
    public loanService: ServiceService,
    public dataCaptureService: LoanServiceService,
    public encryptDecryptService: EncryptDecryptService,
    public router: Router
  ) { }

  ngOnInit(): void {
    //Get Data from parent component & set in child component for updation
    this.loanService.data = JSON.parse(sessionStorage.getItem('appsData'))
    this.data = this.loanService.data;
  }

  // Create Applicant
  createApplicant() {
    let appID: any = sessionStorage.getItem('CURR_APPLICATION_ID');
    let encryptAppID = this.encryptDecryptService.decryptData(appID) //CONVERT ENCRYPTED DATA INTO ORIGIAL DATA USING DECRYPT METHOD
    console.log(encryptAppID)
    this.dataCaptureService.saveApplicant(encryptAppID,this.data).subscribe(
      res => {
          console.log(res);
          this.router.navigate(['/loan-org/loan/main-app-list/loan-processes/process/2']);
        },err => {
          console.log(err)
        }
      )
    }

  inputValidation(event) {
    let value = event.charCode;
    console.log(value == 43 || value == 45 || value == 101 || value == 69 || (value >=48  && value <= 57))
    if(value >=48  && value <= 57){
      return true
    }else{
      return false;
    }
  }
  
  // Update Applicant
  updateApplicant() {
    this.dataCaptureService.updateApplicant(this.data.id,this.data).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/loan-org/loan/main-app-list/loan-processes/process/2']);
      },err => {
        console.log(err)
      }
    )
  }

  back() {
    this.router.navigate(['/loan-org/loan/main-app-list/loan-processes/process/2']);
  }
}

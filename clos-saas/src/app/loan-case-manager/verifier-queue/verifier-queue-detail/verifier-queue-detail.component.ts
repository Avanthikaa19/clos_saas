import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoanCaseManagerServiceService } from '../../service/loan-case-manager-service.service';
import { DocumentList, UdfList } from 'src/app/loan-origination/component/loan-processes/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifier-queue-detail',
  templateUrl: './verifier-queue-detail.component.html',
  styleUrls: ['./verifier-queue-detail.component.scss']
})
export class VerifierQueueDetailComponent implements OnInit {

  sectionDetails;
  notifierService: any;
  docList: DocumentList[] = [];
  udfList: UdfList[] = [];
  udfHeaders: String[] = ['Id', 'Field Id', 'Decimal Value','Date Value', 'Boolean Value', 'Target Id', 'Table Id', 'String Value', 'Number Value','Modified By Name','Modification Time'];
  headers: String[] = ['Document Name', 'Document Type', 'Document Date', 'Required', 'Stage', 'Document Status', 'Data Capture', 'Days in Status', 'File Name', 'File Type'];
  applicantLevel;
  applicationsLevel;
  collateralLevel;

  constructor(
    public dialog: MatDialog,
    public loanCase : LoanCaseManagerServiceService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getDetails();
    this.getDocuments();
    this.getApplicantdetails();
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  
  getDetails() {
    let id = sessionStorage.getItem('appId');
    this.loanCase.getDetails(id).subscribe(
      res => {
        this.sectionDetails = res;
        this.docList = res['documentation']['documentList'];
        this.udfList = res['initialData']['udfFieldValue'];
      }
    )
  }

  applicantDetails:any;
  colatraldetails:any;
  getApplicantdetails() {
    let appid = sessionStorage.getItem('appId');
    this.loanCase.getDetails(appid).subscribe((data:any) =>{
      this.colatraldetails = data.fullData.collateralDetails
        this.applicantDetails = data.fullData.applicantDetails.applicantDetailsList;
        console.log('222222', this.applicantDetails)
    })
  }

  // Verified
  getVerification() {
    let id = sessionStorage.getItem('appId');
    sessionStorage.setItem('TabIndex','2');
    this.loanCase.getVerify(id).subscribe(
      res => {
        this.showNotification('success','Application Verified Successfully')
      }
    )
  }

  back() {
    this.router.navigateByUrl('/loan-case-manager/loan-case-manager-main/verifier-queue')
    sessionStorage.removeItem('appId');
    sessionStorage.getItem('TabIndex');
  }

  closeWindow() {
    setTimeout( () => {
      this.router.navigateByUrl('/loan-case-manager/loan-case-manager-main/verifier-queue')
      sessionStorage.removeItem('appId');
  },100);
}

  // Get Documents
  getDocuments() {
    let id = sessionStorage.getItem('appId');
    this.loanCase.getDocs(id).subscribe(
      res => {
        this.applicantLevel = res['Applicant Level'];
        this.applicationsLevel = res['Application Level'];
        this.collateralLevel = res['Collateral Level'];
      }
    )
  }

}

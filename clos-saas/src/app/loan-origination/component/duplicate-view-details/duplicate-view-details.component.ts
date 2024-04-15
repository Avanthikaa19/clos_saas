import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentList, UdfList } from 'src/app/loan-origination/component/loan-processes/model';
import { Router } from '@angular/router';
import { LoanCaseManagerServiceService } from 'src/app/loan-case-manager/service/loan-case-manager-service.service';
import { LoanServiceService } from '../loan-processes/service/loan-service.service';

@Component({
  selector: 'app-duplicate-view-details',
  templateUrl: './duplicate-view-details.component.html',
  styleUrls: ['./duplicate-view-details.component.scss']
})
export class DuplicateViewDetailsComponent implements OnInit {

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
    public dialogRef: MatDialogRef<DuplicateViewDetailsComponent>,
    public dialog: MatDialog,
    public loanCase : LoanCaseManagerServiceService,
    public   LoanService: LoanServiceService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) 
    public data,

  ) { }

  ngOnInit(): void {
    this.getDetails();
    this.getDocuments();
    // console.log(this.data)
  }

  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  
  getDetails() {
    this.loanCase.getDetails(this.data).subscribe(
      res => {
        this.sectionDetails = res;
        this.docList = res['documentation']['documentList'];
        this.udfList = res['initialData']['udfFieldValue'];
        console.log(this.sectionDetails)
      }
    )
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


  // Delete duplicate apps
deleteDuplicate(){
this.LoanService.deleteApplication(this.data).subscribe(
  res => {
    this.dialogRef.close();
    this.showNotification('success','Application Deleted Successfully')
  },err => {
    console.log(err)
  }
)
}

// close popup
closeDuplicatePopup() {
  this.dialogRef.close();
}

  // Get Documents
  getDocuments() {
        this.loanCase.getDocs(this.data).subscribe(
      res => {
        this.applicantLevel = res['Applicant Level'];
        this.applicationsLevel = res['Application Level'];
        this.collateralLevel = res['Collateral Level'];
      }
    )
  }


}

import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { LoanCaseManagerServiceService } from 'src/app/loan-case-manager/service/loan-case-manager-service.service';

@Component({
  selector: 'app-accepted-detail',
  templateUrl: './accepted-detail.component.html',
  styleUrls: ['./accepted-detail.component.scss',]
})
export class AcceptedDetailComponent implements OnInit {
  loanPurpose: string[] = [];
  value: number;

  constructor(
    public dialogRef: MatDialogRef<AcceptedDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) 
    public data,
    public loanCase: LoanCaseManagerServiceService,
  ) { }

  ngOnInit(): void {
    this.getAcceptedApplicant()
  }

   // underwriter Accepted Edit
   getAcceptedApplicant() {
    this.loanCase.getAcceptEdit(this.data).subscribe(
      res => {
        console.log(res);
       this.amountGrant= res['amountGranted'];
        this.credit=res['creditDecision'];
        console.log(this.amountGrant,this.credit)
      }
    )
  }
  credit:string="accept";
  amountGrant:string = "";
   // underwriter Accepted Edit
   getAcceptedApplicantUpdate() {
    this.loanCase.getAcceptEditUpdate(this.data,this.credit,this.amountGrant).subscribe(
      res => {
        console.log(res);
        console.log(this.amountGrant,this.credit)

      //  this.amountAccepted= res['amountGranted'];
      //   this.creditDecisionAccepted=res['creditDecision'];
      //   console.log(this.amountAccepted,this.creditDecisionAccepted)
      }
    )
  }
}

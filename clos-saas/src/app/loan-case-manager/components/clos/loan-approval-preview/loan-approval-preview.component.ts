import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { ApplicationDetails } from 'src/app/c-los/models/clos';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';

@Component({
  selector: 'app-loan-approval-preview',
  templateUrl: './loan-approval-preview.component.html',
  styleUrls: ['./loan-approval-preview.component.scss']
})
export class LoanApprovalPreviewComponent implements OnInit {
  application: ApplicationDetails = new ApplicationDetails();
  loanStatus:string;
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoanApprovalPreviewComponent>,
    public caseManagerService: CLosService,
    private notifierService: NotifierService,
    private duplicateService: DuplicateCheckingService,
  ) 
  {
    if (data) {
      this.application.id = data.data;
      this.loanStatus = data.status;
      this.getDataById();
    }
  }

  ngOnInit(): void {
  }
  onClose() {
    this.dialogRef.close();
  }
  onSaveBtnClick() {
    this.dialogRef.close();
  }
  onCreatBtnClick() {
    this.showNotification("success", 'Account creation request sent.');
    this.dialogRef.close();
  }
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
  getDataById() {
    this.caseManagerService.getApplicationDetailsByID(this.application.id).subscribe(
      res => {
        this.application = res;
        console.log(res)
      }
    )
  }

  onAcceptClick() {
    console.log("Coming to accept..")
    this.duplicateService.getAcceptProceed(this.application.id, "APPROVE_LOAN", '').subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }

  onRejectClick() {
    console.log("Coming to reject..")
    this.duplicateService.getAcceptProceed(this.application.id, "REJECT_LOAN", '').subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }

}

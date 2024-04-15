import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationDetails } from 'src/app/c-los/models/clos';
import { CLosService } from 'src/app/c-los/service/c-los.service';

@Component({
  selector: 'app-loan-approval-edit',
  templateUrl: './loan-approval-edit.component.html',
  styleUrls: ['./loan-approval-edit.component.scss']
})
export class LoanApprovalEditComponent implements OnInit {
  frequencyType:string[]=['Daily','Weekly','Monthly','Quaterly','Halfyearly','Yearly']
  actionOpen: boolean = false;
  actionMode: boolean;
  actionRemark: string = '';
  application:ApplicationDetails = new ApplicationDetails();
  minValue:number = 1000000;
  maxValue:number = 5000000;
  creditValue:number = 3500000;
  formFieldsFill:boolean=false;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LoanApprovalEditComponent>,
    public caseManagerService:CLosService,
  ) {
    if(data){
      this.application.id = data;
      this.getDataById();
    }
   }

  ngOnInit(): void {
  }

  onReject() {

  }

  onClose() {
    this.dialogRef.close();
  }
  denyApproveClick(action: boolean) {
    this.actionOpen = true;
    this.actionMode = action;
  }
  saveInformation(){
    this.caseManagerService.saveApplication(this.application).subscribe(
      res =>{
        console.log(res);
        this.dialogRef.close();
      }
    )
  }

  getDataById() {
    this.caseManagerService.getApplicationDetailsByID(this.application.id).subscribe(
      res => {
        this.application = res;
        this.application.interestRate = '5';
        console.log(res);
        if (this.application.loanApprovalAmount || this.application.effectiveRate || this.application.downPaymentAmount || this.application.valueDate || this.application.frequency || this.application.instalments || this.application.maturityDate ) {
          this.formFieldsFill=true;
        }
      }
    )
  }

}

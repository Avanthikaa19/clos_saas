import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { ApplicationDetails, LoanTransactionLog } from 'src/app/c-los/models/clos';
import { CLosService } from 'src/app/c-los/service/c-los.service';

@Component({
  selector: 'app-underwriting-preview-popup',
  templateUrl: './underwriting-preview-popup.component.html',
  styleUrls: ['./underwriting-preview-popup.component.scss']
})
export class UnderwritingPreviewPopupComponent implements OnInit {
  actionOpen: boolean = false;
  actionMode: boolean;
  actionRemark: string = '';
  creditLimit:boolean = false;
  duplicateId: any[] = [];
  applicationId:number;
  parentId:number;
  ratioCheckList:any[] = [];
  loanStatus: string;
  activeStepIndex:number = 0;
  collateralCheck:any[] = [];
  creditRate:any[] = [];
  creditLimitValue:any[] = [];
  loading: boolean = false;
  appDetails: any;
  loanTransactionLog:LoanTransactionLog = new LoanTransactionLog();
  constructor(
    public dialog: MatDialog,
    private duplicateService: DuplicateCheckingService,
    public caseManagerService:CLosService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UnderwritingPreviewPopupComponent>,
  ) {
    console.log("Date : "+data)
    this.duplicateId = data.id;
    this.applicationId = data.id;
    this.parentId = data.parentId;
    this.loanStatus = data.loanStatus;
   }

  ngOnInit(): void {
    this.getUnderwritingData();
    this.getCreditRate();
    this.getLoanTransactionLog(this.parentId);
    this.getAppDetails(this.applicationId);
  }
  getAppDetails(id: any) {
    this.loading = true;
    this.duplicateService.getAppDetails(id).subscribe((res) => {
      console.log(res);
      this.appDetails = res;
      this.loading = false;
    });
  }
  onRejectClick() {
    this.dialogRef.close();
  }
  onPendingClick(){
    this.duplicateService.getAcceptProceed(this.duplicateId, "PENDING", '').subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }
  onAcceptClick() {
    this.duplicateService.getAcceptProceed(this.duplicateId, "APPROVE_UNDERWRITE", '').subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }
  onGetCreditLimitClick() {
    this.creditLimit = true;
  }
  onClose() {
    this.dialogRef.close();
  }
  denyApproveClick(action: boolean) {
    this.actionOpen = true;
    this.actionMode = action;
    this.duplicateService.getAcceptProceed(this.duplicateId, "REJECT_UNDERWRITE", '').subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }
  reorderData(ratio: any): any {
    const reorderedItem = {};
    const keys = Object.keys(ratio);
  
    keys.forEach(key => {
      if (key !== 'Range' && !key.endsWith("Decision")) {
        reorderedItem[key] = ratio[key];
      }
    });
  
    // Add 'Range' property to the reordered item in the second position
    if ('Range' in ratio) {
      reorderedItem['Range'] = ratio['Range'];
    }
  
    // Add decision properties after 'Range'
    keys.forEach(key => {
      if (key !== 'Range' && key.endsWith("Decision")) {
        reorderedItem[key] = ratio[key];
      }
    });
  
    console.log(reorderedItem);
    return reorderedItem;
  }
  
  
  getUnderwritingData(){
    this.duplicateService.getUnderwritingData(this.applicationId).subscribe(res => {
      this.ratioCheckList = res.map(item => this.reorderData(item));
      let data = JSON.stringify(this.ratioCheckList);
      this.ratioCheckList = JSON.parse(data);
   });
  }

  getCreditRate(){
    this.duplicateService.getCreditRate(this.applicationId).subscribe(res =>{
      this.creditRate = res[0];
      this.collateralCheck = res[1];
      this.creditLimitValue = res[2];
    })
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getLoanTransactionLog(applicationId : number){
     this.duplicateService.getLoanTransactionData(this.applicationId).subscribe(res => {
       this.loanTransactionLog = res;
     });
  }

}

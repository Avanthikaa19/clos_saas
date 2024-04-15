import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { WizardserviceService } from 'src/app/flow-manager/components/flow-manager/modals/import-export-wizard/service/wizardservice.service';
import { ConfigService } from 'src/app/loan-application/components/services/config.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';


@Component({
  selector: 'app-kyc-preview',
  templateUrl: './kyc-preview.component.html',
  styleUrls: ['./kyc-preview.component.scss']
})
export class KycPreviewComponent implements OnInit {
  applicationList: any;
  proceedAll: boolean;
  duplicateId: any[] = [];
  appDetails: any;
  databaseDetail: any;
  externalkycDetails: any;
  activeStepIndex:number = 0;
  categoryList:string[] = ['Internal KYC CHECK','External KYC CHECK'];
  loading: boolean = false;
  actionOpen: boolean = false;
  actionMode: boolean;
  actionRemark: string = '';
  tabStatus:string;
  status:string;
  selectedIndextab:number;
  applicationDetails: any;
  
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<KycPreviewComponent>,
    public service: ConfigService,
    public caseManagerService:CLosService,
    private route: ActivatedRoute,
    private duplicateService: DuplicateCheckingService,
    private defaultService: LoanServiceService,
    private wizardService: WizardserviceService
  ) {
    this.duplicateId = data.popupId;
    this.tabStatus = data.selectedNavigation;
    this.status = data.status;
    this.selectedIndextab = data.seletedTab;
  }

  ngOnInit(): void {
    this.getDataById(this.duplicateId[0]);
    this.getAppDetails(this.duplicateId[0]);
    this.getDatabaseDetails(this.duplicateId[0]);
    this.getExternalKycDetails(this.duplicateId[0])
  }
  getDataById(id:any) {
    this.caseManagerService.getApplicationDetailsByID(id).subscribe(
      res => {
        this.applicationDetails = res;
        console.log(res)
      }
    )
  }
  //get application details
  getAppDetails(id: any) {
    this.loading = true;
    this.duplicateService.getAppDetails(id).subscribe((res) => {
      this.appDetails = res;
      this.loading = false;
    });
  }
  // get database details
  getDatabaseDetails(id: any) {
    this.wizardService.getMultirowDbdetails(id, "UNDERWRITING_QUEUE").subscribe((res) => {
      this.databaseDetail = res;
    });
  }
  // get database details
  getExternalKycDetails(id: any) {
    this.loading = true;
    this.wizardService.getExternalKYCDetails(id, "EXTERNAL_KYC_COMPLETED").subscribe((res) => {
      this.externalkycDetails = res;
      this.loading = false;
    });
  }

  getExternalKycData() {
    
  }
  onProceed() {
    this.proceedAll = true;
    this.duplicateService.getAcceptProceed(this.duplicateId, "APPROVE_APPLICATION", '').subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }
  onPending() {
    this.proceedAll = true;
    this.duplicateService.getAcceptProceed(this.duplicateId, "PENDING", '').subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }
  onReject() {
    this.proceedAll = true;
    this.duplicateService.getAcceptProceed(this.duplicateId, "REJECT_APPLICATION", this.actionRemark).subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
    });
  }
  denyApproveClick(action: boolean) {
    this.actionOpen = true;
    this.actionMode = action;
  }
  onCloseClick() {
    this.dialogRef.close();
  }
}

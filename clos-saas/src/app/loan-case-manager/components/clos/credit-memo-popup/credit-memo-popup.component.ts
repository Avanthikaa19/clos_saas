import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationDetails,ShareHolders,Partners,Suppliers,Collaterals } from 'src/app/c-los/models/clos';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { ApplicationEntryService } from "src/app/c-los/components/application-entry/service/application-entry.service";

@Component({
  selector: 'app-credit-memo-popup',
  templateUrl: './credit-memo-popup.component.html',
  styleUrls: ['./credit-memo-popup.component.scss']
})
export class CreditMemoPopupComponent implements OnInit {
  activeStepIndex:number = 0;
  headers: ShareHolders[] = [new ShareHolders()];
  partnerHeaders: Partners[] = [new Partners()];
  supplierheaders: Suppliers[] = [new Suppliers()];
  collateralheaders: Collaterals[] = [new Collaterals()];
  categoryList:string[] = ['Corporate Details','Collateral Details'];
  applicationDetails:ApplicationDetails = new ApplicationDetails();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreditMemoPopupComponent>,
    public caseManagerService:CLosService,
    public applicationEntryService: ApplicationEntryService,

  ) {
    if(data){
      this.applicationDetails.id = data;
      this.getDataById();
      this.getMultipleDetails();
    }
   }

  ngOnInit(): void {
  }

  onCloseClick (){
    this.dialogRef.close();
  }
  getMultipleDetails() {
    this.caseManagerService.getMultipleDetails(this.applicationDetails.id).subscribe(
      res => {
        this.headers = res.shareHolders;
        this.partnerHeaders = res.partners;
        this.supplierheaders = res.supplier;
        this.collateralheaders = res.collateralDetails;
      }
    )
  }

  getDataById() {
    this.caseManagerService.getApplicationDetailsByID(this.applicationDetails.id).subscribe(
      res => {
        this.applicationDetails = res;
        console.log(res)
      }
    )
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { CollateralField } from '../../models/config.models';


@Component({
  selector: 'app-collateral-config-detail',
  templateUrl: './collateral-config-detail.component.html',
  styleUrls: ['./collateral-config-detail.component.scss']
})
export class CollateralConfigDetailComponent implements OnInit {
  collateralCategory: string[] = ['Real Estate', 'Equipment', 'Accounts Receivable', 'Inventory', 'Securities', 'Others'];
  collateralType: any;
  collateralData: CollateralField = new CollateralField;
  loanType: string[] = ['Term Loan', 'Working Capital Loan', 'Revolving Credit Lines', 'Equipment Financing', 'Commercial Real Estate Loan', 'Invoice Financing', 'Trade Finance', 'Bridge Loan', 'Mezzanine Loan', 'Debt Consolidation Loan', 'Acquisition Loan', 'Startup Loan', 'Project Finance']

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dupliateService: DuplicateCheckingService,
    private notifierService: NotifierService,

  ) {
    if (data) {
      console.log("data", data)
      this.collateralData = data;
      this.collateralTypeDropdown(data.collateralCategory)
    }
  }

  ngOnInit(): void {

  }

  collateralTypeDropdown(selectCategory: string) {
    this.dupliateService.getCollateralTypeDropdown(selectCategory).subscribe(
      res => {
        console.log(res);
        this.collateralType = res;
      },
    )
  }
  // Notification
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }

  saveCollateralConfig() {
    if (this.collateralData.collateralType == 'Others' || this.collateralData.collateralCategory == 'Others') {
      this.collateralData.collateralType = this.collateralData.collateralInputType;
    }
    this.dupliateService.saveCollateralConfig(this.collateralData).subscribe(
      res => {
        console.log(res);
        this.showNotification('success', 'Saved successfully');
      }
    )
  }

  errMsg() {
    if (!this.collateralData.loanType)
      return '* Loan Type is a required field';

    if (!this.collateralData.collateralCategory)
      return '* Collateral Category is a required field';

    if (!this.collateralData.collateralType && !this.collateralData.collateralInputType)
      return '* Collateral Type is a required field';

    return ''
  }
  disable() {
     if (this.collateralData.collateralCategory == 'Others' || this.collateralData.collateralType == 'Others') {
      return !this.collateralData.collateralInputType;
    }
    if(!this.collateralData.loanType || !this.collateralData.collateralCategory || !this.collateralData.collateralType){
      return true
    }
    return false;
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { MatTabHeaders } from '../../application-entry/models/application-entry';
import { ApplicationDetails, ShareHolders, Statement, Suppliers } from 'src/app/c-los/models/clos';
import { ApplicationEntryService } from '../../application-entry/service/application-entry.service';
import { Attachment, PageData } from 'src/app/c-los/models/clos-table';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { ApplicationEntryPopupComponent } from '../application-entry-popup/application-entry-popup.component';

@Component({
  selector: 'app-financial-information',
  templateUrl: './financial-information.component.html',
  styleUrls: ['./financial-information.component.scss']
})
export class FinancialInformationComponent implements OnInit {
  activeSubTabName: string;
  activeStepIndex: number = 0;
  pageData: PageData;
  option: number = 0;
  userDefinedFields: any;
  filename: any[] = [];
  attachmentFields: string[];
  activeTabName: string;
  call_Status: boolean = false;
  files: File[] = [];
  yearsList: number[] = [];
  statement: Statement[] = [];
  ratioDetails: any[] = [];
  ratioList: string[] = [];
  headers: ShareHolders[] = [new ShareHolders()];
  supplierheaders: Suppliers[] = [new Suppliers()];
  appId: number;
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  matTabHeader: MatTabHeaders[] = [
    { name: "Statement", icon: "file_copy" },
    { name: "Ratio", icon: "file_copy" },
  ];
  constructor(
    public closService: CLosService,
    private cdr: ChangeDetectorRef,
    public encryptDecryptService: EncryptDecryptService,
    private applicationEntryService: ApplicationEntryService,
    public applicationEntryPopupComponent: ApplicationEntryPopupComponent,
  ) {  
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
    this.closService.activeSubTabName$.subscribe((name) => {
    this.activeSubTabName = name;  
  });
  this.appId = applicationEntryPopupComponent.appId;
  console.log("decrypt", this.appId)
  
}

  ngOnInit(): void {  
        
    if (this.appId) {
      this.applicationEntryService.statementDetails = [];
      this.getStatementFields();      
    }
    if (this.applicationEntryService.statementDetails.length) {
      this.statement = this.applicationEntryService.statementDetails;
    } else {
      if(this.call_Status == false)
      {
        // this.calculateYears();
      }
      this.applicationEntryService.statementDetails = this.statement;
    }
    console.log(this.appId);   

    this.closService.getLoanType().subscribe(loanType => {
      this.applicationDetails.typesOfLoan = loanType;
      this.getRatioByLoan();
    });
  }
  onStepSelectionChange(event: any) {
    this.option = event.index;
    this.activeTabName = event.tab.textLabel;   
  }
  getRatioByLoan() {
    const loanType = this.applicationDetails.typesOfLoan;
    this.closService.getRatioByLoan(loanType).subscribe(
      res => {
        this.ratioList = res;       
      },
      error => {
        console.error('Error fetching ratio list:', error);
      }
    );
  }
  getStatementFields() {
    const currentYear = new Date().getFullYear();
    
    this.closService.getstatement(this.appId, this.pageData.currentPage, this.pageData.pageSize).subscribe(
      res => {
        const responseData = res['data'];  
       
        if (Array.isArray(responseData) && responseData.length > 0) {
          this.yearsList = [];
          
          for (let i = 0; i < responseData.length; i++) {
            this.yearsList.push(currentYear - i);
          }            
         
          for (const newData of responseData) {
            const existingDataIndex = this.statement.findIndex(item => item.id === newData.id);
  
            if (existingDataIndex !== -1) {
              this.statement[existingDataIndex] = newData;
              this.ratioDetails[existingDataIndex] = newData;
            } else {
              this.statement.push(newData);
              this.ratioDetails.push(newData);
            }
          }
        } 
        else {
          
        }
  
        this.call_Status = true;
      },      
    );
  }  
  
  saveApplicationData(field, types) {
    this.applicationEntryService.applicationDetails = this.applicationDetails;
  }

  fieldbinding() {
    this.applicationEntryService.statementDetails = this.statement;
  }
  updateCheckValue(index: number, property: string, value: any) {
    if (this.ratioDetails[index]) {
      this.ratioDetails[index][property] = value;
    }
  }
  getDataById() {
    this.closService.getApplicationDetailsByID(this.appId).subscribe(
      res => {
        this.applicationDetails = res;
        this.getRatioByLoan();
        for (let key in res) {
          if (typeof res[key] === 'number' && !this.applicationDetails['officeContactNumber']) {
            this.applicationDetails[key] = res[key].toLocaleString();
          }
        }       
        this.cdr.detectChanges();
      }
    )    
  }

  getPropertyBasedOnRatio(ratio: string): string {
    if (ratio.includes('Current Ratio')) {
      return 'liquidityCurrentRatio';
    }
    else if (ratio.includes('Quick Ratio (Acid-Test Ratio)')) {
      return 'liquidityQuickRatio';
    }
    else if (ratio.includes('Debt-to-Equity Ratio (D/E)')) {
      return 'debtToEquityRatio';
    }
    else if (ratio.includes('Debt Ratio')) {
      return 'debtRatio';
    }
    else if (ratio.includes('Interest Coverage Ratio')) {
      return 'interestCoverageRatio';
    }
    else if (ratio.includes('Gross Profit Margin')) {
      return 'grossProfitMargin';
    }
    else if (ratio.includes('Operating Profit Margin')) {
      return 'operatingProfitMargin';
    }
    else if (ratio.includes('Net Profit Margin')) {
      return 'netProfitMargin';
    }
    else if (ratio.includes('Return on Assets (ROA)')) {
      return 'returnOnAssets';
    }
    else if (ratio.includes('Return on Equity (ROE)')) {
      return 'returnOnEquity';
    }
    else if (ratio.includes('Asset Turnover Ratio')) {
      return 'assetTurnoverRatio';
    }
    else if (ratio.includes('Inventory Turnover Ratio')) {
      return 'inventoryTurnoverRatio';
    }
    else if (ratio.includes('Receivables Turnover Ratio')) {
      return 'receivableTurnoverRatio';
    }
    else if (ratio.includes('Payables Turnover Ratio')) {
      return 'payablesTurnoverRatio';
    }
    else if (ratio.includes('Debt Service Coverage Ratio')) {
      return 'debtServiceChargeCoverageRatio';
    }
    else if (ratio.includes('Fixed Charge Coverage Ratio')) {
      return 'fixedChargeCoverageRatio';
    }
    else if (ratio.includes('Total Debt-to-Total Capital Ratio')) {
      return 'totalDebtToTotalCapitalRatio';
    }
    else if (ratio.includes('Long-Term Debt-to-Equity Ratio')) {
      return 'longTermDebtToEquityRatio';
    }
    else if (ratio.includes('Price-to-Earnings Ratio (P/E)')) {
      return 'priceToEarningsRatio';
    }
    else if (ratio.includes('Price-to-Book Ratio (P/E)')) {
      return 'priceToBookRatio';
    }
    else if (ratio.includes('Altman Z-Score')) {
      return 'altmanZScore';
    }

    return '';
  }  
}

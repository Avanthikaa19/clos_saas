import {Component, Inject, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { PageData } from 'src/app/c-los/models/clos-table';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { loanTypeConfig } from '../../models/config.models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocChecklistComponent } from '../doc-checklist/doc-checklist.component';

@Component({
  selector: 'app-loantype-config-details',
  templateUrl: './loantype-config-details.component.html',
  styleUrls: ['./loantype-config-details.component.scss']
})
export class LoantypeConfigDetailsComponent implements OnInit {
  loanType: string[] = ['Term Loan', 'Working Capital Loan', 'Revolving Credit Lines', 'Equipment Financing', 'Commercial Real Estate Loan', 'Invoice Financing', 'Trade Finance', 'Bridge Loan', 'Mezzanine Loan', 'Debt Consolidation Loan', 'Acquisition Loan', 'Startup Loan', 'Project Finance']
  productLoan:any;
  loanConfig: loanTypeConfig = new loanTypeConfig('','',null,null,'','','','',null,null,'',null);
  loading: boolean = false;
  page: number = 1;
  pageData: PageData;
  collateralCategory: string[] = ['Real Estate','Residential Properties','Machinery and Equipment','Inventory','Accounts Receivable','Vehicles','Investment Porfolios','Cash or Cash Equivalents','Intellectual Property','Business Assets','Accounts or Contracts','Personal Guarantees','Life Insurance Policies','Art and Collectibles','Raw Materials'];
  collateralType:string[] = ['Commercial Property','Residential Property','Industrial Property','Machinery','Vehicles','Office Equipment','Stocks','Bonds','Other']
  document: any[]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dupliateService: DuplicateCheckingService,
    private notifierService: NotifierService, 
    public dialog: MatDialog){ }

  ngOnInit(): void {
    if (this.data) {
      this.loanConfig = this.data;
      this.productLoan = this.productLoanDrpdown(this.loanConfig.loanType);
      this.tableData = Object.keys(this.loanConfig.documents).map(documentType => {
        return {
          documentType: this.loanConfig.documents[documentType].documentType,
          documentDescription:this.loanConfig.documents[documentType].documentDescription, 
          status: this.loanConfig.documents[documentType].status,
        };
      });
    }
  }
    
// to call on dialog close
onChildDataSaved(data: any) {
  console.log('DATA',data)
  this.tableData.push(data);
}

  // Product of loan dropdown
  productLoanDrpdown(selectedLoanType: string){
    this.dupliateService.getProductLoan(selectedLoanType).subscribe(
      res => {
        console.log(res);
        this.productLoan = res;
      },
    )
  }

  onAddDocBtnClick(){
    const dialogRef = this.dialog.open(DocChecklistComponent, {
      height:'35rem',
      width:'60rem'
    });
    dialogRef.componentInstance.onSaveCallback = (data: any) => {
      this.onChildDataSaved(data);
    };
  }

  // Notification
  showNotification(type: string, message: string) {
    this.notifierService.notify(type, message);
  }
 
  // Save loan config details
 onSaveLoanConfig(){
   this.loanConfig.documents = this.tableData;
   this.dupliateService.saveLoanConfig(this.loanConfig).subscribe(
     res => {
       console.log(res);
      this.showNotification('success', 'Saved successfully');
     },
   )
 }

 tableHeaders: string[] = ['Document Type', 'Description', 'Required / Not Required'];
 tableData: any[] = [
  {
    documentType: 'Business Registration/Partnership Deed/Etc',
    documentDescription: 'Valid business registration and licenses',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Photocopy of  identification card for Sole Proprietor / Partners/Directors',
    documentDescription: 'Copy of identification documents for sole proprietor/directors/partners',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Balance Sheet',
    documentDescription: 'Latest audited Balance Sheet of Last 3 (or) 5 years',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Income Statement (P&L statement)',
    documentDescription: 'Latest audited Income Statement  of Last 3 (or) 5 years',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Cash Flow statement',
    documentDescription: 'Latest audited Cash Flow statement of Last 3 (or) 5 years',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Bank Statements',
    documentDescription: 'Recent bank statements (past 6-12 months)',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Tax Returns',
    documentDescription: 'Corporate tax returns (last 3 (or) 5 years) (Form B / Form P / Form PT) & Tax Receipts',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Tax Returns',
    documentDescription: 'personal tax returns (3 (or) 5 years)',
    // remarks: '',
    status: false
  },
  {
    documentType: 'Business Plan',
    documentDescription: 'Detailed business plan, including financial projections',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Memorandum and Articles of Association ',
    documentDescription: `Copies of the company's Memorandum and Articles of Association.`,
    // remarks: '',
    status: true
  },
  {
    documentType: 'Board Resolution',
    documentDescription: 'Resolution authorizing the loan application',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Collateral Documents',
    documentDescription: 'Details of collateral offered',
    // remarks: '',
    status: true
  },
  {
    documentType: 'Insurance Policies',
    documentDescription: 'Proof of insurance coverage',
    // remarks: '',
    status: false
  },
  {
    documentType: 'Environmental Compliance',
    documentDescription: 'Compliance certificates',
    // remarks: '',
    status: false
  },
  {
    documentType: 'Personal Financial Statements',
    documentDescription: 'Personal financial statements for guarantors',
    // remarks: '',
    status: false
  },
  {
    documentType: 'Project proposal / agreement / contract on sustainability',
    documentDescription: `sustainability's contract/agreement/project proposal`,
    // remarks: '',
    status: true
  },
  {
    documentType: 'Other Supporting Documents/Additional Attachments',
    documentDescription: 'Any additional documents requested by the lender',
    // remarks: '',
    status: true
  }
];

  // to calculate Inter-Bank Offer Rate
  calculateInterBankRate(){
    if( this.loanConfig.operator === '+'){
      this.loanConfig.interestRate = ( this.loanConfig.baseRate +  this.loanConfig.spread).toString();
    }
    else if(this.loanConfig.operator === '-'){
      this.loanConfig.interestRate = ( this.loanConfig.baseRate -  this.loanConfig.spread).toString();
    }
  }


  errMsg() {

    if (!this.loanConfig.loanType)
      return '* Loan Type is a required field';
    
    if (!this.loanConfig.product)
      return '* Product is a required field';
    
    if (!this.loanConfig.maxLoanAmount)
      return '* Maximum value is a required field';
    
    if (!this.loanConfig.minLoanAmount)
      return '* Minimum value is a required field';

    if((this.loanConfig.loanType && this.loanConfig.loanType === 'Term Loan') && (this.loanConfig.product && this.loanConfig.product === 'Variable-Rate Term Loan')){
      if (!this.loanConfig.baseRate)
        return '* Base Rate is a required field';
      if (!this.loanConfig.operator)
        return '* Operator is a required field';
      if (!this.loanConfig.spread)
        return '* Spread is a required field';
      if (!this.loanConfig.interestRate)
        return '* Interest Rate is a required field';
    }

    if((this.loanConfig.loanType && this.loanConfig.loanType === 'Term Loan') && (this.loanConfig.product && this.loanConfig.product === 'Fixed-Rate Term Loan')){
      if (!this.loanConfig.interestRate)
        return '* Interest Rate is a required field';
    }

    return ''
  }

  disableButton(){
    if(this.loanConfig.loanType === 'Term Loan' && this.loanConfig.product === 'Variable-Rate Term Loan'){
      if(this.loanConfig.maxLoanAmount && this.loanConfig.minLoanAmount && this.loanConfig.baseRate && this.loanConfig.operator && this.loanConfig.spread && this.loanConfig.interestRate)
          return false;
      else
          return true;
    }
    else if(this.loanConfig.loanType === 'Term Loan' && this.loanConfig.product === 'Fixed-Rate Term Loan'){
      if(this.loanConfig.maxLoanAmount && this.loanConfig.minLoanAmount && this.loanConfig.interestRate)
        return false;
      else
        return true;
    }
    else {
      if(this.loanConfig.loanType && this.loanConfig.product && this.loanConfig.maxLoanAmount && this.loanConfig.minLoanAmount)
        return false;
      else
        return true;  
    }

    return true;
  }

}
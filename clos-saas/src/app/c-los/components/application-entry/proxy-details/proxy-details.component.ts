import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ProxyDetail, ProxyOverallDetails } from 'src/app/c-los/models/clos';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { ApplicationEntryComponent } from '../application-entry.component';
import { Attachment, PageData } from "src/app/c-los/models/clos-table";
import { MatTabHeaders } from '../models/application-entry';
import { ProxyFinancialInformation,ApplicationDetails } from "../../../models/clos";
import { ApplicationEntryService } from "../service/application-entry.service";
import { UserDefinedCustomFields } from "src/app/loan-application/components/models/config.models";
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
@Component({
  selector: 'app-proxy-details',
  templateUrl: './proxy-details.component.html',
  styleUrls: ['./proxy-details.component.scss']
})
export class ProxyDetailsComponent implements OnInit {
  proxyFinancialInformation: ProxyFinancialInformation[]=[];
  activeStepIndex: number = 0;
  yearsList: number[] = [];  
  activeTabName: string;
  appId: number;
  pageData: PageData;
  activeSubTabName: string;
  index: number = 0;
  option: number = 0;
  matTabHeader: MatTabHeaders[] = [
    { name: "Statement", icon: "file_copy" },
    { name: "Ratio", icon: "file_copy" },
  ];
  yearrange: string[] = ['Last 3 Years','Last 5 Years'];
  selectedOption: string = 'Last 3 Years';
  filteredLoanList:any[];
  loanConfigList: any[] = [];
  files: File[] = [];
  ratioList:string[] = [];
  proxyDetails: ProxyDetail = new ProxyDetail();
  proxyOverallDetails: ProxyOverallDetails[]=[];
  ratioDetails: any[] = []
  // proxyStatement: ProxyStatement[]=[];
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  conversionOptions: string[] = ['Thousands', 'Millions', 'Billions', 'Trillions'];
  proxyRatioIndex: number =1 ;
  call_Status: boolean = false;
  activeProxySubTabName: string;

  constructor(
    public router: Router,
    public closService: CLosService,
    private applicationEntryComponent: ApplicationEntryComponent,
    private applicationEntryService: ApplicationEntryService,
    public encryptDecryptService: EncryptDecryptService,
    private cdr: ChangeDetectorRef,
    ) {
      this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
      let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
    this.appId = +decryptId;
    console.log("Decrypted ID :",this.appId)
    this.closService.activeProxySubTabName$.subscribe((name) => {
      this.activeSubTabName = name;
    });
    if(this.applicationEntryService.proxyCompanyDetails){
      this.proxyDetails = this.applicationEntryService.proxyCompanyDetails;
    }
    
  }

  ngOnInit(): void {
    this.applicationEntryComponent.goToNextStep();
    this.applicationEntryComponent.goToPreviousStep();
    this.applicationDetails = this.applicationEntryService.applicationDetails;
    this.ratioDetails = this.applicationEntryService.ratioDetails;
    this.getRatioByLoan();
    if (Object.keys(this.applicationEntryService.proxyCompanyDetails).length === 0 && this.appId) {
      this.getProxyCompanyDetails();
      this.applicationEntryService.proxyCompanyDetails = this.proxyDetails;
      this.getDataById();
    }
    if(this.applicationEntryService.proxystatementDetails.length === 0 && this.appId){
      this.getProxyFinancialInfo();
    }
    if(this.applicationEntryService.proxystatementDetails != null){
      this.calculateYears();
      if(this.applicationEntryService.proxystatementDetails.length){
        this.proxyFinancialInformation = this.applicationEntryService.proxystatementDetails;
        // this.ratioDetails = this.applicationEntryService.proxystatementDetails
      }
      if(this.applicationEntryService.ratioDetails.length){
        this.ratioDetails = this.applicationEntryService.proxystatementDetails;
      }
    } 
    else {
      if (this.call_Status == false) {
        this.calculateYears();
      }
      this.applicationEntryService.proxystatementDetails = this.proxyFinancialInformation;
      //this.applicationEntryService.proxystatementDetails = this.ratioDetails;
    }
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        if (e.url === '/application-entry/application-view' || e.url === '/home') {
          this.applicationEntryService.proxyCompanyDetails = null;
          this.applicationEntryService.proxystatementDetails = [];
          sessionStorage.removeItem('loantype')
        }
      }
    });
  }

  nexttab() {
    this.applicationEntryComponent.goToNextStep();
  }
  previoustab() {
    this.applicationEntryComponent.goToPreviousStep();
  }
  onStepSelectionChange(event: any) {
    this.option = event.index;
    this.activeTabName = event.tab.textLabel;
    if (this.option == 1) {
      // this.toCalculateRatio();
    }
  }
  preventLetterE(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }

  }

  getDataById() {
    this.closService.getApplicationDetailsByID(this.appId).subscribe(
      res => {
        this.applicationDetails = res;
        if (!this.applicationDetails) {
          //
        }
        else {
          console.log(this.applicationDetails.typesOfLoan)
          const loantype = this.applicationDetails.typesOfLoan;
          this.closService.getRatioByLoan(loantype).subscribe(
            res => {
              this.ratioList = res;
            }
          )
        }
        this.cdr.detectChanges();
        console.log(res)
      }
    )
  }

  getRatioByLoan() {
    this.closService.getRatioByLoan(this.applicationDetails.typesOfLoan).subscribe(
      res => {
        this.ratioList = res;
      }
    )
  }
  calculateYears() {
    const currentYear = new Date().getFullYear();
    const selectedOptionValue = parseInt(this.proxyDetails.proxyYearCalculation?.split(' ')[1], 10);
    this.yearsList = [];
    this.proxyFinancialInformation=[];
    for (let i = 0; i < selectedOptionValue; i++) {
      this.yearsList.push(currentYear - i);
    }
    for(let i=0;i<this.yearsList.length;i++){
      // this.statement[i].year=0
      this.proxyFinancialInformation.push({
        "year":this.yearsList[i],
        "proxyLatestInterimFinancialStatementUploadsRemarks": "Remark",
        "proxyFinancialStatementOfPast5YearsUploadsRemarks": "Up to Date",
        "proxyTaxReturnsForTheLast3YearsUploadsRemarks": "All Filed",
        "proxyCommonStock": 0,
        "proxyTreasuryStock": 0,
        "proxyOtherComprehensiveIncome": 0,
        "proxyTotalEquity": 0,
        "proxyDebts": 0,
        "proxyLongTermDebt": "0",
        "proxyDebtPeriod": "0",
        "proxyTotalLiabilities": 0,
        "proxyTermLiabilities": 0,
        "proxyCurrentLiabilities": 0,
        "proxyTotalAssets": 0,
        "proxyFixedAssets": 0,
        "proxyCurrentAssets": 0,
        "proxyNonCurrentAssets": 0,
        "proxyTangibleAssets": 0,
        "proxyIntangibleAssets": 0,
        "proxyIssuedCapital": 0,
        "proxyFinancialPaidUpCapital": 0,
        "proxyAdditionalPaidInCapital": 0,
        "proxyGeneralReserves": 0,
        "proxyCreditBalance": 0,
        "proxyInventory": 0,
        "proxyFinancialShareholdersEquity": 0,
        "proxyEbit": 0,
        "proxyEbitda": 0,
        "proxyInterestExpense": 0,
        "proxyGrossProfit": 0,
        "proxyTotalRevenue": 0,
        "proxyOperatingIncome": 0,
        "proxyNetIncome": 0,
        "proxyInterestPayable": 0,
        "proxyNetSales": 0,
        "proxyAverageTotalAssets": 0,
        "proxyCostOfGoodsSold": 0,
        "proxyAverageInventory": 0,
        "proxyAverageAccountsReceivable": 0,
        "proxyPurchases": 0,
        "proxyAverageAccountsPayable": 0,
        "proxyLeasePayments": 0,
        "proxyPrincipalRepayments": 0,
        "proxyMarketPricePerShare": 0,
        "proxyEarningsPerShare": 0,
        "proxyBookValuePerShare": 0,
        "proxyWorkingCapital": 0,
        "proxyFinancialRetainedEarnings": 0,
        "proxyMarketValueOfEquity": 0,
        "proxySales": 0,
        "proxyOperationActivitiesNetCash": 0,
        "proxyDepreciationAndAmortization": 0,
        "proxyChangesInWorkingCapital": 0,
        "proxyInvestingActivitiesNetCash": 0,
        "proxyFinancingActivitiesNetCash": 0,
        "proxyProceedsFromBorrowings": 0,
        "proxyRepaymentOfBorrowings": 0,
        "proxyDividendsPaid": 0,
        "proxyLiquidityCurrentRatio": 0,
        "proxyLiquidityQuickRatio": 0,
        "proxyDebtToEquityRatio": 0,
        "proxyDebtRatio": 0,
        "proxyInterestCoverageRatio": 0,
        "proxyGrossProfitMargin": 0,
        "proxyOperatingProfitMargin": 0,
        "proxyNetProfitMargin": 0,
        "proxyReturnOnAssets": 0,
        "proxyReturnOnEquity": 0,
        "proxyAssetTurnoverRatio": 0,
        "proxyInventoryTurnoverRatio": 0,
        "proxyReceivableTurnoverRatio": 0,
        "proxyPayablesTurnoverRatio": 0,
        "proxyDebtServiceCoverageRatio": 0,
        "proxyFixedChargeCoverageRatio": 0,
        "proxyTotalDebtToTotalCapitalRatio": 0,
        "proxyLongTermDebtToEquityRatio": 0,
        "proxyPriceToEarningsRatio": 0,
        "proxyPriceToBookRatio": 0,
        "proxyAltmanZScore": 0,
        "proxyRevenueRetainedEarnings": 0,
        "applicationId": 0,
        "id": 0,
      })
    }
     }

  // onFinancialFile(event: any,field: string) {
  //   this.files = event.target.files;
  //   this.uploadFinancialInformation();
  // }
  fieldbinding(){
    this.applicationEntryService.proxystatementDetails = this.proxyFinancialInformation;
  }
  saveCompanyData(field, types) {
    this.applicationEntryService.proxyCompanyDetails = this.proxyDetails;
  }
  saveApplicationData(field, types) {
    this.applicationEntryService.proxyOverallDetails = this.proxyOverallDetails;
    console.log('FINAL', this.applicationEntryService.proxyOverallDetails);
    
  } 

  getAttachementFileDownload(id: number) {
    this.closService.getAttachmentDetails([id]).subscribe(attachment => {
      if (attachment) {
        let fileName = attachment[0].fileName
        this.closService.getAttachmentDownload(id).subscribe(res => {
          var blob = new Blob([res])
          var url = window.URL.createObjectURL(blob);
          var anchor = document.createElement("a");
          anchor.download = fileName;
          anchor.href = url;
          anchor.click();
        })
      }
    })
  }
  removeAttachment(type: string, index: number,j?: number) {
    // if (type == 'latestInterimFinancialStatement') {
    //   this.uploads.latestInterimFinancialStatement.splice(index, 1)
    //   console.log(this.uploads.latestInterimFinancialStatement)
    // }
    // else if (type == 'financialStatementOfPast5Years') {
    //   this.uploads.financialStatementOfPast5Years.splice(index, 1)
    // }
    // else if (type == 'taxReturnsForTheLast3Years') {
    //   this.uploads.taxReturnsForTheLast3Years.splice(index, 1)
    // }
    
  }
  // uploadFinancialInformation() {
  //   for (let i = 0; i < this.files.length; i++) {
  //     this.closService.getUploadFile(this.files[i]).subscribe(
  //       res => {}
  //       )
  //     }
  //   }
    statement1:any;
// get proxy details
getProxyCompanyDetails(){
  this.closService.getProxyCompanyDetails(this.appId,this.pageData.currentPage,this.pageData.pageSize).subscribe(
    (res:any) => {
      this.proxyDetails = res;
    }
  )
}

getProxyFinancialInfo() {
  const currentYear = new Date().getFullYear();
  this.closService.getProxyFinancialDetails(this.appId, this.pageData.currentPage, this.pageData.pageSize).subscribe(
    res => {
      const responseData = res['data'];
      if (Array.isArray(responseData) && responseData.length > 0) {
        this.yearsList = [];
        for (let i = 0; i < responseData.length; i++) {
          this.yearsList.push(currentYear - i);
        }
      }
      for (const newData of responseData) {
        const existingDataIndex = this.proxyFinancialInformation.findIndex(item => item.id === newData.id);
        if (existingDataIndex !== -1) {
          this.proxyFinancialInformation[existingDataIndex] = newData;
          this.ratioDetails[existingDataIndex] = newData;
        } else {
          this.proxyFinancialInformation.push(newData);
          this.ratioDetails.push(newData);
        }
      }
    }
  )
  this.call_Status = true;
}

calculateRatio(fieldName, index, comingValue) {
  const field = fieldName;
  this.applicationDetails[field] = comingValue;
  while (index >= this.ratioDetails.length) {
    this.ratioDetails.push({ ...this.applicationDetails });
  }
  this.ratioDetails[index][field] = comingValue;
  console.log(this.applicationDetails,'fields')
  console.log(this.ratioDetails,'ratioDtials')
  this.ratioDetails[index]['proxyLiquidityCurrentRatio'] = isNaN(this.applicationDetails.proxyCurrentAssets / this.applicationDetails.proxyCurrentLiabilities) ? null : this.applicationDetails.proxyCurrentAssets / this.applicationDetails.proxyCurrentLiabilities;
  this.ratioDetails[index]['proxyLiquidityQuickRatio'] = isNaN(((this.applicationDetails.proxyCurrentAssets - this.applicationDetails.proxyInventory) / this.applicationDetails.proxyCurrentLiabilities)) ? null : ((this.applicationDetails.proxyCurrentAssets - this.applicationDetails.proxyInventory) / this.applicationDetails.proxyCurrentLiabilities);
  this.ratioDetails[index]['proxyDebtToEquityRatio'] = isNaN(this.applicationDetails.proxyDebts / this.applicationDetails.proxyFinancialShareholdersEquity) ? null : this.applicationDetails.proxyDebts / this.applicationDetails.proxyFinancialShareholdersEquity;
  this.ratioDetails[index]['proxyDebtRatio'] = isNaN(this.applicationDetails.proxyDebts / this.applicationDetails.proxyTotalAssets) ? null : this.applicationDetails.proxyDebts / this.applicationDetails.proxyTotalAssets;
  this.ratioDetails[index]['proxyInterestCoverageRatio'] = isNaN(this.applicationDetails.proxyEbit / this.applicationDetails.proxyInterestExpense) ? null : this.applicationDetails.proxyEbit / this.applicationDetails.proxyInterestExpense;
  this.ratioDetails[index]['proxyGrossProfitMargin'] = isNaN((this.applicationDetails.proxyGrossProfit / this.applicationDetails.proxyTotalRevenue) * 100) ? null : (this.applicationDetails.proxyGrossProfit / this.applicationDetails.proxyTotalRevenue) * 100;
  this.ratioDetails[index]['proxyOperatingProfitMargin'] = isNaN((this.applicationDetails.proxyOperatingIncome / this.applicationDetails.proxyTotalRevenue) * 100) ? null : (this.applicationDetails.proxyOperatingIncome / this.applicationDetails.proxyTotalRevenue) * 100;
  this.ratioDetails[index]['proxyNetProfitMargin'] = isNaN((this.applicationDetails.proxyNetIncome / this.applicationDetails.proxyTotalRevenue) * 100) ? null : (this.applicationDetails.proxyNetIncome / this.applicationDetails.proxyTotalRevenue) * 100;
  this.ratioDetails[index]['proxyReturnOnAssets'] = isNaN(this.applicationDetails.proxyNetIncome / this.applicationDetails.proxyTotalAssets) ? null : this.applicationDetails.proxyNetIncome / this.applicationDetails.proxyTotalAssets;
  this.ratioDetails[index]['proxyReturnOnEquity'] = isNaN(this.applicationDetails.proxyNetIncome / this.applicationDetails.proxyFinancialShareholdersEquity) ? null : this.applicationDetails.proxyNetIncome / this.applicationDetails.proxyFinancialShareholdersEquity;
  this.ratioDetails[index]['proxyInventoryTurnoverRatio'] = isNaN(this.applicationDetails.proxyCostOfGoodsSold / this.applicationDetails.proxyAverageInventory) ? null : this.applicationDetails.proxyCostOfGoodsSold / this.applicationDetails.proxyAverageInventory;
  this.ratioDetails[index]['proxyReceivableTurnoverRatio'] = isNaN(this.applicationDetails.proxyNetSales / this.applicationDetails.proxyAverageAccountsReceivable) ? null : this.applicationDetails.proxyNetSales / this.applicationDetails.proxyAverageAccountsReceivable;
  this.ratioDetails[index]['proxyAssetTurnoverRatio'] = isNaN(this.applicationDetails.proxyNetSales / this.applicationDetails.proxyAverageTotalAssets) ? null : this.applicationDetails.proxyNetSales / this.applicationDetails.proxyAverageTotalAssets;
  this.ratioDetails[index]['proxyPayablesTurnoverRatio'] = isNaN(this.applicationDetails.proxyPurchases / this.applicationDetails.proxyAverageAccountsPayable) ? null : this.applicationDetails.proxyPurchases / this.applicationDetails.proxyAverageAccountsPayable;
  this.ratioDetails[index]['proxyDebtServiceCoverageRatio'] = isNaN(this.applicationDetails.proxyEbitda / this.applicationDetails.proxyDebts) ? null : this.applicationDetails.proxyEbitda / this.applicationDetails.proxyDebts;
  this.ratioDetails[index]['proxyFixedChargeCoverageRatio'] = isNaN(((this.applicationDetails.proxyEbit + this.applicationDetails.proxyLeasePayments) / (this.applicationDetails.proxyInterestExpense + this.applicationDetails.proxyLeasePayments))) ? null : ((this.applicationDetails.proxyEbit + this.applicationDetails.proxyLeasePayments) / (this.applicationDetails.proxyInterestExpense + this.applicationDetails.proxyLeasePayments));
  this.ratioDetails[index]['proxyTotalDebtToTotalCapitalRatio'] = isNaN(((this.applicationDetails.proxyDebts) / (this.applicationDetails.proxyDebts + this.applicationDetails.proxyFinancialShareholdersEquity))) ? null : ((this.applicationDetails.proxyDebts) / (this.applicationDetails.proxyDebts + this.applicationDetails.proxyFinancialShareholdersEquity));
  this.ratioDetails[index]['proxyLongTermDebtToEquityRatio'] = isNaN(this.applicationDetails.proxyLongTermDebt / this.applicationDetails.proxyFinancialShareholdersEquity) ? null : this.applicationDetails.proxyLongTermDebt / this.applicationDetails.proxyFinancialShareholdersEquity;
  this.ratioDetails[index]['proxyPriceToEarningsRatio'] = isNaN(this.applicationDetails.proxyMarketPricePerShare / this.applicationDetails.proxyEarningsPerShare) ? null : this.applicationDetails.proxyMarketPricePerShare / this.applicationDetails.proxyEarningsPerShare;
  this.ratioDetails[index]['proxyPriceToBookRatio'] = isNaN(this.applicationDetails.proxyMarketPricePerShare / this.applicationDetails.proxyBookValuePerShare) ? null : this.applicationDetails.proxyMarketPricePerShare / this.applicationDetails.proxyBookValuePerShare;
  this.proxyFinancialInformation.forEach((statementObj, index) => {
    const correspondingRatioDetail = this.ratioDetails[index]; // Using index for matching
    if (correspondingRatioDetail) {
      statementObj.proxyLiquidityCurrentRatio = correspondingRatioDetail.proxyLiquidityCurrentRatio;
      statementObj.proxyLiquidityQuickRatio = correspondingRatioDetail.proxyLiquidityQuickRatio;
      statementObj.proxyDebtToEquityRatio = correspondingRatioDetail.proxyDebtToEquityRatio;
      statementObj.proxyDebtRatio = correspondingRatioDetail.proxyDebtRatio;
      statementObj.proxyInterestCoverageRatio = correspondingRatioDetail.proxyInterestCoverageRatio;
      statementObj.proxyGrossProfitMargin = correspondingRatioDetail.proxyGrossProfitMargin;
      statementObj.proxyOperatingProfitMargin = correspondingRatioDetail.proxyOperatingProfitMargin;
      statementObj.proxyNetProfitMargin = correspondingRatioDetail.proxyNetProfitMargin;
      statementObj.proxyReturnOnAssets = correspondingRatioDetail.proxyReturnOnAssets;
      statementObj.proxyReturnOnEquity = correspondingRatioDetail.proxyReturnOnEquity;
      statementObj.proxyAssetTurnoverRatio = correspondingRatioDetail.proxyAssetTurnoverRatio;
      statementObj.proxyInventoryTurnoverRatio = correspondingRatioDetail.proxyInventoryTurnoverRatio;
      statementObj.proxyReceivableTurnoverRatio = correspondingRatioDetail.proxyReceivableTurnoverRatio;
      statementObj.proxyPayablesTurnoverRatio = correspondingRatioDetail.proxyPayablesTurnoverRatio;
      statementObj.proxyDebtServiceCoverageRatio = correspondingRatioDetail.proxyDebtServiceCoverageRatio;
      statementObj.proxyFixedChargeCoverageRatio = correspondingRatioDetail.proxyFixedChargeCoverageRatio;
      statementObj.proxyTotalDebtToTotalCapitalRatio = correspondingRatioDetail.proxyTotalDebtToTotalCapitalRatio;
      statementObj.proxyLongTermDebtToEquityRatio = correspondingRatioDetail.proxyLongTermDebtToEquityRatio;
      statementObj.proxyPriceToEarningsRatio = correspondingRatioDetail.proxyPriceToEarningsRatio;
      statementObj.proxyPriceToBookRatio = correspondingRatioDetail.proxyPriceToBookRatio;
      statementObj.proxyAltmanZScore = correspondingRatioDetail.proxyAltmanZScore;
      
    }
});
}

updateCheckValue(index: number, property: string, value: any) {
  if (this.ratioDetails[index]) {
    this.ratioDetails[index][property] = value;
  }
}
getPropertyBasedOnRatio(ratio: string): string {
  if (ratio.includes('Current Ratio')) {
    return 'proxyLiquidityCurrentRatio';
  }
  else if (ratio.includes('Quick Ratio (Acid-Test Ratio)')) {
    return 'proxyLiquidityQuickRatio';
  }
  else if (ratio.includes('Debt-to-Equity Ratio (D/E)')) {
    return 'proxyDebtToEquityRatio';
  }
  else if (ratio.includes('Debt Ratio')) {
    return 'proxyDebtRatio';
  }
  else if (ratio.includes('Interest Coverage Ratio')) {
    return 'proxyInterestCoverageRatio';
  }
  else if (ratio.includes('Gross Profit Margin')) {
    return 'proxyGrossProfitMargin';
  }
  else if (ratio.includes('Operating Profit Margin')) {
    return 'proxyOperatingProfitMargin';
  }
  else if (ratio.includes('Net Profit Margin')) {
    return 'proxyNetProfitMargin';
  }
  else if (ratio.includes('Return on Assets (ROA)')) {
    return 'proxyReturnOnAssets';
  }
  else if (ratio.includes('Return on Equity (ROE)')) {
    return 'proxyReturnOnEquity';
  }
  else if (ratio.includes('Asset Turnover Ratio')) {
    return 'proxyAssetTurnoverRatio';
  }
  else if (ratio.includes('Inventory Turnover Ratio')) {
    return 'proxyInventoryTurnoverRatio';
  }
  else if (ratio.includes('Receivables Turnover Ratio')) {
    return 'proxyReceivableTurnoverRatio';
  }
  else if (ratio.includes('Payables Turnover Ratio')) {
    return 'proxyPayablesTurnoverRatio';
  }
  else if (ratio.includes('Debt Service Coverage Ratio')) {
    return 'proxyDebtServiceCoverageRatio';
  }
  else if (ratio.includes('Fixed Charge Coverage Ratio')) {
    return 'proxyFixedChargeCoverageRatio';
  }
  else if (ratio.includes('Total Debt-to-Total Capital Ratio')) {
    return 'proxyTotalDebtToTotalCapitalRatio';
  }
  else if (ratio.includes('Long-Term Debt-to-Equity Ratio')) {
    return 'proxyLongTermDebtToEquityRatio';
  }
  else if (ratio.includes('Price-to-Earnings Ratio (P/E)')) {
    return 'proxyPriceToEarningsRatio';
  }
  else if (ratio.includes('Price-to-Book Ratio (P/E)')) {
    return 'proxyPriceToBookRatio';
  }
  else if (ratio.includes('Altman Z-Score')) {
    return 'proxyAltmanZScore';
  }
  return '';
}


// upload financial report
onFinancialFile(event: any) {
  this.files = event.target.files;
  this.uploadFinancialInformation();
}

uploadFinancialInformation() {
  for (let i = 0; i < this.files.length; i++) {
    this.closService.getUploadFile(this.files[i]).subscribe(
      res => {
        if (!this.proxyFinancialInformation) {
          this.proxyFinancialInformation = [];
         }        
        for (let i = 0; i < res.length; i++) {
          const financialData = res[i];            
          if (!this.proxyFinancialInformation[i]) {                
              this.proxyFinancialInformation[i] = new ProxyFinancialInformation();
          }           
          this.proxyFinancialInformation[i].year = financialData.year;
          // this.proxyFinancialInformation[i].numerals = financialData.numerals;
          this.proxyFinancialInformation[i].proxyCommonStock = financialData.commonStock;
          this.proxyFinancialInformation[i].proxyTreasuryStock = financialData.treasuryStock;
          this.proxyFinancialInformation[i].proxyOtherComprehensiveIncome = financialData.otherComprehensiveIncome;
          this.proxyFinancialInformation[i].proxyTotalEquity = financialData.totalEquity;
          this.proxyFinancialInformation[i].proxyDebts = financialData.debts;
          this.proxyFinancialInformation[i].proxyLongTermDebt = financialData.longTermDebt;
          this.proxyFinancialInformation[i].proxyDebtPeriod = financialData.debtPeriod;
          this.proxyFinancialInformation[i].proxyTotalLiabilities = financialData.totalLiabilities;
          this.proxyFinancialInformation[i].proxyTermLiabilities = financialData.termLiabilities;
          this.proxyFinancialInformation[i].proxyCurrentLiabilities = financialData.currentLiabilities;
          this.proxyFinancialInformation[i].proxyTotalAssets = financialData.totalAssets;
          this.proxyFinancialInformation[i].proxyCurrentAssets = financialData.currentAssets;
          this.proxyFinancialInformation[i].proxyFixedAssets = financialData.fixedAssets;
          this.proxyFinancialInformation[i].proxyNonCurrentAssets = financialData.nonCurrentAssets;
          this.proxyFinancialInformation[i].proxyTangibleAssets = financialData.tangibleAssets;
          this.proxyFinancialInformation[i].proxyIntangibleAssets = financialData.intangibleAssets;
          this.proxyFinancialInformation[i].proxyIssuedCapital = financialData.issuedCapital;
          this.proxyFinancialInformation[i].proxyFinancialPaidUpCapital = financialData.paidUpCapital;
          this.proxyFinancialInformation[i].proxyAdditionalPaidInCapital = financialData.additionalPaid_InCapital;
          this.proxyFinancialInformation[i].proxyGeneralReserves = financialData.generalReserves;
          this.proxyFinancialInformation[i].proxyCreditBalance = financialData.creditBalance;
          this.proxyFinancialInformation[i].proxyInventory = financialData.inventory;
          this.proxyFinancialInformation[i].proxyFinancialShareholdersEquity = financialData.financialShareholdersEquity;
          this.proxyFinancialInformation[i].proxyEbit = financialData.ebit;
          this.proxyFinancialInformation[i].proxyEbitda = financialData.ebitda;
          this.proxyFinancialInformation[i].proxyInterestExpense = financialData.interestExpense;
          this.proxyFinancialInformation[i].proxyGrossProfit = financialData.grossProfit;
          this.proxyFinancialInformation[i].proxyTotalRevenue = financialData.totalRevenue;
          this.proxyFinancialInformation[i].proxyNetIncome = financialData.netIncome;
          this.proxyFinancialInformation[i].proxyInterestPayable = financialData.interestPayable;
          this.proxyFinancialInformation[i].proxyNetSales = financialData.netSales;
          this.proxyFinancialInformation[i].proxyAverageTotalAssets = financialData.averageTotalAssets;
          this.proxyFinancialInformation[i].proxyCostOfGoodsSold = financialData.costOfGoodsSold;
          this.proxyFinancialInformation[i].proxyAverageInventory = financialData.averageInventory;
          this.proxyFinancialInformation[i].proxyAverageAccountsReceivable = financialData.averageAccountsReceivable;
          this.proxyFinancialInformation[i].proxyPurchases = financialData.purchases;
          this.proxyFinancialInformation[i].proxyAverageAccountsPayable = financialData.averageAccountsPayable;
          this.proxyFinancialInformation[i].proxyLeasePayments = financialData.leasePayments;
          this.proxyFinancialInformation[i].proxyPrincipalRepayments = financialData.principalRepayments;
          this.proxyFinancialInformation[i].proxyMarketPricePerShare = financialData.marketPricePerShare;
          this.proxyFinancialInformation[i].proxyEarningsPerShare = financialData.earningsPerShare;
          this.proxyFinancialInformation[i].proxyBookValuePerShare = financialData.bookValuePerShare;
          this.proxyFinancialInformation[i].proxyWorkingCapital = financialData.workingCapital;
          this.proxyFinancialInformation[i].proxyFinancialRetainedEarnings = financialData.financialRetainedEarnings;
          this.proxyFinancialInformation[i].proxyMarketValueOfEquity = financialData.marketValueOfEquity;
          this.proxyFinancialInformation[i].proxySales = financialData.sales;
          this.proxyFinancialInformation[i].proxyOperationActivitiesNetCash = financialData.operationActivitiesNetCash;
          this.proxyFinancialInformation[i].proxyDepreciationAndAmortization = financialData.depreciationAndAmortization;
          this.proxyFinancialInformation[i].proxyChangesInWorkingCapital = financialData.changesInWorkingCapital;
          this.proxyFinancialInformation[i].proxyInvestingActivitiesNetCash = financialData.investingActivitiesNetCash;
          this.proxyFinancialInformation[i].proxyFinancingActivitiesNetCash = financialData.financingActivitiesNetCash;
          this.proxyFinancialInformation[i].proxyProceedsFromBorrowings = financialData.proceedsFromBorrowings;
          this.proxyFinancialInformation[i].proxyRepaymentOfBorrowings = financialData.repaymentOfBorrowings;
          this.proxyFinancialInformation[i].proxyDividendsPaid = financialData.dividendsPaid;    
          this.calculateRatio('commonStock', i, this.proxyFinancialInformation[i].proxyCommonStock); 
          this.calculateRatio('debts', i, this.proxyFinancialInformation[i].proxyDebts); 
          this.calculateRatio('longTermDebt', i, this.proxyFinancialInformation[i].proxyLongTermDebt); 
          this.calculateRatio('currentLiabilities', i, this.proxyFinancialInformation[i].proxyCurrentLiabilities); 
          this.calculateRatio('totalAssets', i, this.proxyFinancialInformation[i].proxyTotalAssets);
          this.calculateRatio('currentAssets', i, this.proxyFinancialInformation[i].proxyCurrentAssets); 
          this.calculateRatio('inventory', i, this.proxyFinancialInformation[i].proxyInventory);           
          this.calculateRatio('financialShareholdersEquity', i, this.proxyFinancialInformation[i].proxyFinancialShareholdersEquity);  
          this.calculateRatio('ebit', i, this.proxyFinancialInformation[i].proxyEbit); 
          this.calculateRatio('ebitda', i, this.proxyFinancialInformation[i].proxyEbitda); 
          this.calculateRatio('interestExpense', i, this.proxyFinancialInformation[i].proxyInterestExpense); 
          this.calculateRatio('grossProfit', i, this.proxyFinancialInformation[i].proxyGrossProfit); 
          this.calculateRatio('totalRevenue', i, this.proxyFinancialInformation[i].proxyTotalRevenue); 
          this.calculateRatio('operatingIncome', i, this.proxyFinancialInformation[i].proxyOperatingIncome); 
          this.calculateRatio('netIncome', i, this.proxyFinancialInformation[i].proxyNetIncome); 
          this.calculateRatio('interestPayable', i, this.proxyFinancialInformation[i].proxyInterestPayable); 
          this.calculateRatio('netSales', i, this.proxyFinancialInformation[i].proxyNetSales); 
          this.calculateRatio('averageTotalAssets', i, this.proxyFinancialInformation[i].proxyAverageTotalAssets); 
          this.calculateRatio('costOfGoodsSold', i, this.proxyFinancialInformation[i].proxyCostOfGoodsSold); 
          this.calculateRatio('averageInventory', i, this.proxyFinancialInformation[i].proxyAverageInventory); 
          this.calculateRatio('averageAccountsReceivable', i, this.proxyFinancialInformation[i].proxyAverageAccountsReceivable); 
          this.calculateRatio('purchases', i, this.proxyFinancialInformation[i].proxyPurchases); 
          this.calculateRatio('averageAccountsPayable', i, this.proxyFinancialInformation[i].proxyAverageAccountsPayable); 
          this.calculateRatio('leasePayments', i, this.proxyFinancialInformation[i].proxyLeasePayments); 
          this.calculateRatio('principalRepayments', i, this.proxyFinancialInformation[i].proxyPrincipalRepayments); 
          this.calculateRatio('marketPricePerShare', i, this.proxyFinancialInformation[i].proxyMarketPricePerShare); 
          this.calculateRatio('earningsPerShare', i, this.proxyFinancialInformation[i].proxyEarningsPerShare); 
          this.calculateRatio('bookValuePerShare', i, this.proxyFinancialInformation[i].proxyBookValuePerShare); 
          this.calculateRatio('workingCapital', i, this.proxyFinancialInformation[i].proxyWorkingCapital); 
          this.calculateRatio('financialRetainedEarnings', i, this.proxyFinancialInformation[i].proxyFinancialRetainedEarnings); 
          this.calculateRatio('marketValueOfEquity', i, this.proxyFinancialInformation[i].proxyMarketValueOfEquity); 
          this.calculateRatio('sales', i, this.proxyFinancialInformation[i].proxySales); 
          this.fieldbinding();                  
          this.cdr.detectChanges();                
      }
        this.applicationDetails.additionalPaidInCapital = res.additionalPaidInCapital;
        this.applicationDetails.averageAccountsPayable = res.averageAccountsPayable;
        this.applicationDetails.averageAccountsReceivable = res.averageAccountsReceivable;
        this.applicationDetails.averageInventory = res.averageInventory;
        this.applicationDetails.averageTotalAssets = res.averageTotalAssets;
        this.applicationDetails.bookValuePerShare = res.bookValuePerShare;
        this.applicationDetails.changesInWorkingCapital = res.changesInWorkingCapital;
        this.applicationDetails.commonStock = res.commonStock;
        this.applicationDetails.costOfGoodsSold = res.costOfGoodsSold;
        this.applicationDetails.creditBalance = res.creditBalance;
        this.applicationDetails.currentAssets = res.currentAssets;
        this.applicationDetails.currentLiabilities = res.currentLiabilities;
        this.applicationDetails.debtPeriod = res.debtPeriod;
        this.applicationDetails.debts = res.debts;
        this.applicationDetails.depreciationAndAmortization = res.depreciationAndAmortization;
        this.applicationDetails.dividendsPaid = res.dividendsPaid;
        this.applicationDetails.earningsPerShare = res.earningsPerShare;
        this.applicationDetails.ebit = res.ebit;
        this.applicationDetails.ebitda = res.ebitda;
        this.applicationDetails.financialRetainedEarnings = res.financialRetainedEarnings;
        this.applicationDetails.financialShareholdersEquity = res.financialShareholdersEquity;
        this.applicationDetails.financingActivitiesNetCash = res.financingActivitiesNetCash;
        this.applicationDetails.fixedAssets = res.fixedAssets;
        this.applicationDetails.generalReserves = res.generalReserves;
        this.applicationDetails.grossProfit = res.grossProfit;
        this.applicationDetails.intangibleAssets = res.intangibleAssets;
        this.applicationDetails.interestExpense = res.interestExpense;
        this.applicationDetails.interestPayable = res.interestPayable;
        this.applicationDetails.inventory = res.inventory;
        this.applicationDetails.investingActivitiesNetCash = res.investingActivitiesNetCash;
        this.applicationDetails.issuedCapital = res.issuedCapital;
        this.applicationDetails.leasePayments = res.leasePayments;
        this.applicationDetails.longTermDebt = res.longTermDebt;
        this.applicationDetails.marketPricePerShare = res.marketPricePerShare;
        this.applicationDetails.marketValueOfEquity = res.marketValueOfEquity;
        this.applicationDetails.netIncome = res.netIncome;
        this.applicationDetails.netSales = res.netSales;
        this.applicationDetails.nonCurrentAssets = res.nonCurrentAssets;
        this.applicationDetails.operatingIncome = res.operatingIncome;
        this.applicationDetails.operationActivitiesNetCash = res.operationActivitiesNetCash;
        this.applicationDetails.otherComprehensiveIncome = res.otherComprehensiveIncome;
        this.applicationDetails.paidUpCapital = res.paidUpCapital;
        this.applicationDetails.principalRepayments = res.principalRepayments;
        this.applicationDetails.proceedsFromBorrowings = res.proceedsFromBorrowings;
        this.applicationDetails.purchases = res.purchases;
        this.applicationDetails.repaymentOfBorrowings = res.repaymentOfBorrowings;
        this.applicationDetails.revenueRetainedEarnings = res.revenueRetainedEarnings;
        this.applicationDetails.sales = res.sales;
        this.applicationDetails.tangibleAssets = res.tangibleAssets;
        this.applicationDetails.termLiabilities = res.termLiabilities;
        this.applicationDetails.totalAssets = res.totalAssets;
        this.applicationDetails.totalEquity = res.totalEquity;
        this.applicationDetails.totalLiabilities = res.totalLiabilities;
        this.applicationDetails.totalRevenue = res.totalRevenue;
        this.applicationDetails.treasuryStock = res.treasuryStock;
        this.applicationDetails.workingCapital = res.workingCapital;
        this.applicationDetails.numerals = res[i].numerals;
        this.cdr.detectChanges();
      this.fieldbinding();
      this.cdr.detectChanges();
      }
    )
  }
}

}

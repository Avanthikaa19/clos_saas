import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApplicationDetails, Statement } from "src/app/c-los/models/clos";
import { PageData } from "src/app/c-los/models/clos-table";
import { CLosService } from "src/app/c-los/service/c-los.service";

@Component({
  selector: "app-ratio-preview-popup",
  templateUrl: "./ratio-preview-popup.component.html",
  styleUrls: ["./ratio-preview-popup.component.scss"],
})
export class RatioPreviewPopupComponent implements OnInit {
  yearsList: number[] = [];
  ratioList: string[] = [];
  appId: number;
  pageData: PageData;
  statement: Statement[] = [];
  ratioDetails: any[] = [];
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RatioPreviewPopupComponent>,
    public caseManagerService:CLosService,
    public closService: CLosService
  ) {
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
    this.appId = data;
  }

  ngOnInit(): void {
    this.getRatioByLoan();
    this.getDataById(this.data);
    if(this.appId)
    {
      this.getStatementFields();
    }
  }
  getDataById(id:any) {
    this.caseManagerService.getApplicationDetailsByID(id).subscribe(
      res => {
        this.applicationDetails = res;
        console.log(res)
      }
    )
  }

  getRatioByLoan() {
    this.closService.getRatioByLoan("Term Loan").subscribe(
      (res) => {
        this.ratioList = res;
      },
      (error) => {
        console.error("Error fetching ratio list:", error);
      }
    );
  }

  getPropertyBasedOnRatio(ratio: string): string {
    if (ratio.includes("Current Ratio")) {
      return "liquidityCurrentRatio";
    } else if (ratio.includes("Quick Ratio (Acid-Test Ratio)")) {
      return "liquidityQuickRatio";
    } else if (ratio.includes("Debt-to-Equity Ratio (D/E)")) {
      return "debtToEquityRatio";
    } else if (ratio.includes("Debt Ratio")) {
      return "debtRatio";
    } else if (ratio.includes("Interest Coverage Ratio")) {
      return "interestCoverageRatio";
    } else if (ratio.includes("Gross Profit Margin")) {
      return "grossProfitMargin";
    } else if (ratio.includes("Operating Profit Margin")) {
      return "operatingProfitMargin";
    } else if (ratio.includes("Net Profit Margin")) {
      return "netProfitMargin";
    } else if (ratio.includes("Return on Assets (ROA)")) {
      return "returnOnAssets";
    } else if (ratio.includes("Return on Equity (ROE)")) {
      return "returnOnEquity";
    } else if (ratio.includes("Asset Turnover Ratio")) {
      return "assetTurnoverRatio";
    } else if (ratio.includes("Inventory Turnover Ratio")) {
      return "inventoryTurnoverRatio";
    } else if (ratio.includes("Receivables Turnover Ratio")) {
      return "receivableTurnoverRatio";
    } else if (ratio.includes("Payables Turnover Ratio")) {
      return "payablesTurnoverRatio";
    } else if (ratio.includes("Debt Service Coverage Ratio")) {
      return "debtServiceChargeCoverageRatio";
    } else if (ratio.includes("Fixed Charge Coverage Ratio")) {
      return "fixedChargeCoverageRatio";
    } else if (ratio.includes("Total Debt-to-Total Capital Ratio")) {
      return "totalDebtToTotalCapitalRatio";
    } else if (ratio.includes("Long-Term Debt-to-Equity Ratio")) {
      return "longTermDebtToEquityRatio";
    } else if (ratio.includes("Price-to-Earnings Ratio (P/E)")) {
      return "priceToEarningsRatio";
    } else if (ratio.includes("Price-to-Book Ratio (P/E)")) {
      return "priceToBookRatio";
    } else if (ratio.includes("Altman Z-Score")) {
      return "altmanZScore";
    }
    return "";
  }

  updateCheckValue(index: number, property: string, value: any) {
    if (this.ratioDetails[index]) {
      this.ratioDetails[index][property] = value;
    }
  }

  getStatementFields() {
    const currentYear = new Date().getFullYear();

    this.closService.getstatement(this.appId,this.pageData.currentPage,this.pageData.pageSize).subscribe(
      (res) => {
        const responseData = res["data"];
        if (Array.isArray(responseData) && responseData.length > 0) {
          this.yearsList = [];
          for (let i = 0; i < responseData.length; i++) {
            this.yearsList.push(currentYear - i);
          }
          for (const newData of responseData) {
            const existingDataIndex = this.statement.findIndex(
              (item) => item.id === newData.id
            );
            if (existingDataIndex !== -1) {
              this.statement[existingDataIndex] = newData;
              this.ratioDetails[existingDataIndex] = newData;
            } else {
              this.statement.push(newData);
              this.ratioDetails.push(newData);
            }
          }
        } else {
        }
      });
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}

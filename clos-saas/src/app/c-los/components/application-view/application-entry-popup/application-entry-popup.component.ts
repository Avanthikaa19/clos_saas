import { Component, Inject, NgZone, OnInit, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CLosService } from "src/app/c-los/service/c-los.service";

@Component({
  selector: "app-application-entry-popup",
  templateUrl: "./application-entry-popup.component.html",
  styleUrls: ["./application-entry-popup.component.scss"],
})
export class ApplicationEntryPopupComponent implements OnInit {
  appId: number;
  activeStepIndex: number = 0;
  activesubtabIndex: number = 0;
  activeproxysubtabIndex: number = 0;
  categoryList: any;
  id: string;
  fieldList: any;
  fieldkeyList: any;
  corporateFieldList: any;
  supfieldKeyList: any;
  uploadKeys: any;
  attachmentNames: string[] = [];
  attachmentRemarks: string[] = [];
  attachmentNameArray: any;
  filesname: any;
  filename: any[] = [];
  attachmentNameString: string;
  attachmentFields: string[];
  userDefinedFields: any;
  shareHoldersList: any;
  partnersList: any;
  suppliersList: any;
  collateralList: any;
  dynamicUploads: any[];
  attachmentName: string;
  attachments: any[];
  fileData: any[];
  processedAttachments: any[] = [];
  activeproxySubTabName: string;
  companyList: any;
  companyfieldKey: string[];
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ApplicationEntryPopupComponent>,
    private closDataEntryService: CLosService,
    private closService: CLosService,
    private ngZone: NgZone
  ) {
    console.log("data in popup", data);
    this.id = data;
    this.appId = data;
  }

  ngOnInit(): void {
    this.getCategoryList();
    this.activeproxysubtabIndex = 0;
  }
  extractAndSendLoanType(res: any): void {
    const loanType = res["TYPES OF LOAN"];
    this.closDataEntryService.setLoanType(loanType);
  }
  //get the first mat-tab-group label
  onStepSelectionChange(event: any) {
    console.group("fiest");
    if (
      event.tab.textLabel != "Corporate Details" &&
      event.tab.textLabel != "Proxy Details"
    ) {
      this.tabChange(event.tab.textLabel);
    } 
    else if (event.tab.textLabel === "Proxy Details") {
      this.activeproxysubtabIndex = 0;
      setTimeout(() => {
        this.activeproxysubtabIndex = 0;
      });
      this.proxyTabChange("Company Information");
    } 
    else if (event.index === 0) {
      this.activesubtabIndex = 0;
      setTimeout(() => {
        this.activesubtabIndex = 0; // Activate the first tab in the second mat-tab-group
      });
      this.corporateTabChange("Business and operation Information");
    }
  }

  //get the second mat-tab-group label
  onSelectsubCategory(event: any) {
    this.corporateTabChange(event.tab.textLabel);
  }
  onSelectProxysubCategory(event: any) {
    this.proxyTabChange(event.tab.textLabel);
  }
  onCloseClick() {
    this.dialogRef.close();
  }

  loading: boolean = false;
  //get category list (mat-tab label)
  getCategoryList() {
    this.loading = true;
    this.closDataEntryService.getCategoryList(this.appId).subscribe(
      (res) => {
        this.categoryList = res;
        this.loading = false;
      },
      (error) => {
        console.log("error", error);
      }
    );
  }
  getAttachmentData(attachmentData: string): any[] {
    try {
      this.fileData = JSON.parse(attachmentData);
      return JSON.parse(attachmentData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  }

  getAttachementFileDownload(id: number) {
    console.log("getAttachementFileDownload");
    this.closDataEntryService
      .getAttachmentDetails([id])
      .subscribe((attachment) => {
        if (attachment) {
          let fileName = attachment[0].fileName;
          this.closDataEntryService
            .getAttachmentDownload(id)
            .subscribe((res) => {
              var blob = new Blob([res]);
              var url = window.URL.createObjectURL(blob);
              var anchor = document.createElement("a");
              anchor.download = fileName;
              anchor.href = url;
              anchor.click();
            });
        }
      });
  }
  //get the field value of first mat group
  tabChange(category: string): void {
    if (category == "Uploads") {
      category = "DynamicUploads";
    }
    this.closDataEntryService.getFieldList(this.data, category).subscribe(
      (res) => {
        this.fieldList = res;
        this.userDefinedFields = res["userDefined"];
        this.collateralList = res["CollateralDetails"];
        this.dynamicUploads = res["DynamicUpload"];
        this.filename = [];
        console.log(this.fieldList);
        if (category == "Applicant Details") {
          this.attachments = this.getAttachmentData(res["APPLICANT SIGNATURE"]);
          this.attachmentName = "APPLICANT SIGNATURE";
        }
        if (category == "Collateral Details") {
          let collateralData = res["CollateralDetails"];
          this.attachmentFields = [
            "COLLATERAL DOCUMENTS",
            "GUARANTOR AGREEMENT",
          ];
          this.attachmentFields = [
            "COLLATERAL DOCUMENTS",
            "GUARANTOR AGREEMENT",
          ];
          let allAttachments = [];
          if (collateralData) {
            for (const detail of collateralData) {
              if (detail["COLLATERAL DOCUMENTS"]) {
                const collateralDocuments = JSON.parse(
                  detail["COLLATERAL DOCUMENTS"]
                );
                allAttachments.push(collateralDocuments);
              }
            }
          }
          const guarantorAgreement = JSON.parse(res["GUARANTOR AGREEMENT"]);
          allAttachments.push(guarantorAgreement);
          this.filename = allAttachments;
        }
        if (
          (category === "DynamicUploads" || category === "Uploads") &&
          this.dynamicUploads
        ) {
          this.processedAttachments = this.dynamicUploads.map((upload) => {
            const attachmentData = this.getAttachmentData(
              upload.ATTACHMENT_RESPONSE
            );
            return {
              name: upload.NAME,
              attachmentData: attachmentData,
              remarks: upload.REMARKS,
            };
          });
        }
        if (category == "Reference") {
          this.attachmentFields = [
            "VENDORS AGREEMENT",
            "SUPPLIERS AGREEMENT",
            "PARTNERS  AGREEMENT",
          ];
          this.attachmentFields.forEach((fieldName) => {
            if (res[fieldName]) {
              this.filename.push(JSON.parse(res[fieldName]));
            }
          });
          console.log(this.filename);
        }
        const fieldKey = [];
        Object.keys(res).forEach((key) => {
          fieldKey.push(key);
        });
        this.fieldkeyList = fieldKey;
      },
      (error) => {
        console.log("error", error);
      }
    );
  }

  //get the field value of second mat group
  corporateTabChange(category: string): void {
    this.closDataEntryService.getFieldList(this.data, category).subscribe(
      (res) => {
        this.corporateFieldList = res;
        this.userDefinedFields = res["userDefined"];
        console.log(res);
        this.filename = [];
        if (category == "Business and operation Information") {
          const typesOfLoan = res["TYPES OF LOAN"];
          this.closDataEntryService.setLoanType(typesOfLoan);
        }
        if (category == "Financial Information") {
          console.log("financial information");
          this.attachmentFields = [
            "FINANCIAL STATEMENT OF PAST 5 YEARS",
            "LATEST INTERIM  FINANCIAL STATEMENTS",
            "TAX RETURNS FOR THE LAST 3YEARS",
          ];
          this.attachmentFields.forEach((fieldName) => {
            if (res[fieldName]) {
              this.filename.push(JSON.parse(res[fieldName]));
            }
          });
          console.log(this.filename);
        }
        const supfieldKey = Object.keys(res);
        this.supfieldKeyList = supfieldKey;
        if (category == "Ownership") {
          this.shareHoldersList = res["ShareHolders"];
          this.partnersList = res["Partners"];
          this.attachmentFields = ["AUTHORIZED SIGNATURES"];

          this.attachmentFields.forEach((fieldName) => {
            if (this.shareHoldersList) {
              this.shareHoldersList.forEach((shareHolder) => {
                const authorizedSignatures = JSON.parse(
                  shareHolder["SHAREHOLDER AUTHORIZED SIGNATURES"]
                );
                if (authorizedSignatures) {
                  authorizedSignatures.forEach((signature) => {
                    this.filename.push(signature);
                  });
                }
              });
            }
          });
          console.log(this.filename);
        }
        if (category == "Suppliers") {
          this.suppliersList = res["Suppliers"];
          console.log(this.suppliersList);
          this.attachmentFields = ["SUPPLIERS AGREEMENT "];
          if (this.suppliersList) {
            this.suppliersList.forEach((shareHolder) => {
              const authorizedSignatures = JSON.parse(shareHolder["AGREEMENT"]);
              if (authorizedSignatures) {
                authorizedSignatures.forEach((signature) => {
                  this.filename.push(signature);
                });
              }
            });
          }
          console.log(this.filename);
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  }
  proxyTabChange(category: string): void {
    this.closDataEntryService.getFieldList(this.data,category).subscribe(
      (res:any) => {
        console.log(res);
        this.companyList = res;
        const companyfieldKey = Object.keys(res);
        this.companyfieldKey = companyfieldKey;
      },
      (error) => {
        console.log("error", error);
      }
    );
  }

  getDesiredOrderKeys(shareHolder: any, name: string) {
    if (name == "ShareHolders") {
      return [
        "NAME",
        "DESIGNATION",
        "CONTACT NUMBER",
        "OFFICE ADDRESS",
        "HOME ADDRESS",
        "MAIL ID",
        "PASSPORT NUMBER",
        "DOB",
        "AGE",
        "NATION ID",
        "TIN",
        "AUTHORIZED SIGNATURES",
      ];
    }
    if (name == "Partners") {
      return [
        "ENTITY NAME",
        "DIRECTOR NAME",
        "OFFICE ADDRESS",
        "CONTACT NUMBER",
        "MAIL ID",
        "ULTIMATE BENEFICIAL OWNER",
        "KYC DOCUMENT NUMBER",
        "UNIQUE IDENTIFIER",
      ];
    }
    if (name == "Collateral") {
      return [
        "COLLATERAL CATEGORY",
        "COLLATERAL TYPE",
        "COLLATERAL AMOUNT",
        "COLLATERAL CURRENCY",
        "COLLATERAL VALUE",
        "MARKET VALUE",
        "COLLATERAL ASSET",
        "COLLATERAL DESCRIPTION",
        "HAIRCUT",
        "LOAN TO VALUE RATIO",
        "COLLATERAL DOCUMENTS REMARKS",
        "COLLATERAL DOCUMENTS",
      ];
    }
    if (name == "Supplier") {
      return [
        "COMPANY NAME",
        "COMPANY CONTACT NUMBER",
        "CONTACT PERSON",
        "CONTACT NUMBER",
        "CONTACT EMAIL",
        "COMPANY ADDRESS",
        "COMPANY REGISTRATION NUMBER",
        "AGREEMENT",
      ];
    }
    return [];
  }
}

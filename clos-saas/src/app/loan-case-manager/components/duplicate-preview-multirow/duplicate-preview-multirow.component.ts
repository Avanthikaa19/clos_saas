import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTabGroup } from "@angular/material/tabs";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from "@angular/router";
import { number } from "echarts";
import { DuplicateCheckingService } from "src/app/duplicate-checking/services/duplicate-checking.service";
import { WizardserviceService } from "src/app/flow-manager/components/flow-manager/modals/import-export-wizard/service/wizardservice.service";
import { ConfigService } from "src/app/loan-application/components/services/config.service";
import { LoanServiceService } from "src/app/loan-origination/component/loan-processes/service/loan-service.service";
import { SelfClaimComponent } from "../self-claim/self-claim.component";
import { RejectionConfirmationComponent } from "../rejection-confirmation/rejection-confirmation.component";

@Component({
  selector: "app-duplicate-preview-multirow",
  templateUrl: "./duplicate-preview-multirow.component.html",
  styleUrls: ["./duplicate-preview-multirow.component.scss"],
})
export class DuplicatePreviewMultirowComponent implements OnInit {
  duplicateId: any[] = [];
  selectedIndex: number = 0;
  tabIndex: any = 0;
  isProceedButtonEnabled: boolean = false;
  id: number;
  getlocalname;
  appId: any;
  appDetails: any;
  databaseDetail: any;
  multidatabaseDetail: any;
  activeRule: any;
  databaseKey: any;
  matchedColumn: any;
  appFielslist: any[] = [];
  configurations: any[] = [];
  appdetailList: any[] = [];
  displaydbList: any[] = [];
  appFieldsData: any[] = [];
  tableFieldsData: any[] = [];
  got1: any[] = [];
  gotTab: any[] = [];
  tableFieldsData1: any[] = [];
  dbDetails: any[] = [];
  collectdb: [] = [];
  multiDB: any[] = [];
  dbItems: any[] = [];
  applicationKey: any;
  matchFound: boolean = false;
  selectedMatTabLabel: any;
  status: boolean;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  selectedId: any;
  tabSelect: boolean = false;
  buttonSelect: boolean;
  loading: boolean = false;
  highLighter: any[] = [];
  tabStatus: any;
  actionOpen: boolean = false;
  actionMode: boolean;
  actionRemark: string = '';
  negativeTable: string = '';
  duplicateTable: string = '';
  duplicateData: any[] = [];
  negativeData: any[] = [];
  negativeArray: any;
  negativeTableName;
  nagativKeys;
  negativeValues;
  codeTagging: any = [
    "PF",
    "PB",
    "GC",
    "GD",
    "GG",
    "HF",
    "UU",
    "68",
    "65",
    "99",
    "2V",
    "PASS",
  ];
  applicationList: any;
  Dupdecision: Dupdecision = new Dupdecision();
  selectedCodeTag: any[] = [];
  statuses: any[] = [];
  statusArray: any[] = []
  length: number;
  selectedNavigation: string;
  ruleUsed: string;
  noMatch;
  selectedTabname: string;
  proceedAll: boolean;
  closeBtn: boolean = false;
  hideProceedBtn: boolean = false;
  selectedOptions: string[] = new Array(this.codeTagging.length);
  selectedOptionsArray: any[] = [];
  duplicateAppFields:string ='';
  duplicateTableFields:string ='';
  negativeAppFields:string ='';
  negativeTableFields:string ='';
  areAllReasonCodesSelected = false; // Initialize to false
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DuplicatePreviewMultirowComponent>,
    public service: ConfigService,
    private route: ActivatedRoute,
    private duplicateService: DuplicateCheckingService,
    private defaultService: LoanServiceService,
    private wizardService: WizardserviceService
  ) {
    this.duplicateId = data.popupId;
    console.log("DUPLICATE PREVIEW ID", this.duplicateId)
    this.selectedNavigation = data.selectedNavigation;
    this.selectedTabname = data.status;
    this.tabStatus = data.status;
    this.buttonSelect = data.buttonSelectAll;
    this.closeBtn = JSON.parse(localStorage.getItem("closeBtn"));
    this.hideProceedBtn = JSON.parse(localStorage.getItem("ProceedBtn"));
    console.log("closeBtn", this.closeBtn);
    if (this.selectedTabname == "notMatch") {
      this.hideProceedBtn = true;
    } else if (this.selectedTabname == "exactMatch") {
      this.hideProceedBtn = true;
    } else if (this.selectedTabname == "Unverified") {
      this.hideProceedBtn = true;
    } else if (this.selectedTabname == "verificationInProgress") {
      this.closeBtn = false;
      this.hideProceedBtn = true;
    } else if (this.selectedTabname == "verificationQueue") {
    }
  }

  ngOnInit(): void {
    this.getAppDetails(this.duplicateId[0]);
    console.log("data", this.duplicateId[0]);
    this.getDatabaseDetails(this.duplicateId[0]);
  }

  onOptionChange(i: number, j: number) {
    console.log(this.selectedOptionsArray);
    this.updateReasonCodesSelectedStatus()

  }
  updateReasonCodesSelectedStatus() {
    console.log('selectedOptionsArray', this.selectedOptionsArray)
    let forCheck = this.selectedOptionsArray.flatMap(innerArray => innerArray);
    console.log('forCheck', forCheck)
    this.areAllReasonCodesSelected = forCheck.every(option => option !== '');
    console.log('areAllReasonCodesSelected:', this.areAllReasonCodesSelected);
  }

  isAnyReasonCodeSelected(i: number): boolean {
    return this.selectedOptionsArray[i].some(option => option !== null);
  }

  onCloseClick() {
    if (this.selectedTabname == "notMatch") {
      //this.closeBtn = false;
      this.dialogRef.close(2);
    } else if (this.selectedTabname == "exactMatch") {
      // this.closeBtn = false;
      this.dialogRef.close(3);
    } else if (this.selectedTabname == "Unverified") {
      //this.closeBtn = false;
      this.dialogRef.close(4);
    } else if (this.selectedTabname == "verificationInProgress") {
      //this.closeBtn = true;
      // this.hideProceedBtn = false;
      localStorage.setItem("closeBtn", JSON.stringify(this.closeBtn));
      localStorage.setItem("ProceedBtn", JSON.stringify(this.hideProceedBtn));
      this.dialogRef.close(1);
    } else if (this.selectedTabname == "verificationQueue") {
      this.dialogRef.close(0);
    }
  }

  //TAB CHANGE FUNCTION
  selectTab(event) {
    this.tabSelect = true;
    console.log("selectTabCheck", event);
    this.tabIndex = event.index;
    this.selectedMatTabLabel = event.tab.textLabel;
    console.log("selectTabCheck", this.selectedMatTabLabel);
    this.getAppDetails(this.selectedMatTabLabel);
    this.getDatabaseDetails(this.selectedMatTabLabel);
  }

  appDetailsKeys: any;
  appDetailsValues: any;
  //get application details
  getAppDetails(id: any) {
    this.loading = true;
    this.duplicateService.getAppDetails(id).subscribe((res) => {
      this.appDetails = res;
      console.log(this.appDetails)
      this.loading = false;
    });
  }

  formatDOB(timestamp: number): string {
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return '';
  }

  // get database details
  getDatabaseDetails(id: any) {
    this.wizardService.getMultirowDbdetails(id, this.selectedNavigation).subscribe((res) => {
      this.databaseDetail = res;
      if (this.databaseDetail) {
        this.duplicateData = this.databaseDetail['DUPLICATE CHECKING'];
        this.negativeData = this.databaseDetail['NEGATIVE CHECKING'];
        this.negativeTable = this.databaseDetail['NEGATIVE CHECKING'][0].tableName;
        this.duplicateTable = this.databaseDetail['DUPLICATE CHECKING'][0].tableName;
        this.negativeArray = this.databaseDetail['NEGATIVE CHECKING'][0].multipleMatchedResultList;
        this.negativeAppFields = this.databaseDetail['NEGATIVE CHECKING'][0].multipleMatchedResultList[0].matchedColumns[0].appFields;
        this.negativeTableFields = this.databaseDetail['NEGATIVE CHECKING'][0].multipleMatchedResultList[0].matchedColumns[0].tableFields;
        this.duplicateAppFields = this.databaseDetail['DUPLICATE CHECKING'][0].multipleMatchedResultList[0].matchedColumns[0].appFields;
        this.duplicateTableFields = this.databaseDetail['DUPLICATE CHECKING'][0].multipleMatchedResultList[0].matchedColumns[0].tableFields;
        console.log(this.negativeArray)
        this.nagativKeys = Object.keys(this.negativeArray[0]);
        this.negativeValues = Object.values(this.negativeArray[0]);
        console.log(this.nagativKeys);

        if (this.negativeArray && this.negativeArray.length > 0) {
          this.negativeTableName = this.negativeArray.map(item => item.tableName);
        }
      }
      //  
      this.selectedOptionsArray = this.databaseDetail.map(item => item.multipleMatchedResultList.map(_ => ''));
      this.statusArray = this.databaseDetail.map(item => item.multipleMatchedResultList.map(_ => ''));
      this.length = this.databaseDetail.length;
      this.databaseDetail.forEach((item, index) => {
        this.dbDetails.push(this.databaseDetail[index]?.multipleMatchedResultList)
        console.log(this.dbDetails);
        this.noMatch = this.dbDetails['dupDecisionAfter'];
        console.log("No Match", this.noMatch)
      })
      //  this.databaseKey = Object.keys(this.databaseDetail);
      //  this.selectedCodeTag = Array(this.databaseDetail[0]?.multipleMatchedResultList.length).fill('');
      console.log("Database", this.dbDetails);
      for (let duplicate in this.dbDetails) {
        console.log("duplicate", duplicate);
        this.noMatch = this.dbDetails[duplicate].finalDecisionStage;
        console.log("No Match", this.noMatch)
        this.multiDB.push(this.dbDetails[duplicate].recordDetails);
        if (this.dbDetails[duplicate].matchedCategory == "NOT_MATCHED") {
          this.dbDetails[duplicate].matchedCategory = "NOT MATCHED";
        } else if (
          this.dbDetails[duplicate].matchedCategory == "UNVERIFIED"
        ) {
          this.dbDetails[duplicate].matchedCategory = "UNVERIFIED";
        }
      }
      this.highlightMatches(this.dbDetails)
    });
  }

  //get active rule
  getactiveRule() {
    this.duplicateService.getactiveRule().subscribe((res) => {
      this.activeRule = res;
      for (let config of this.activeRule?.configurations) {
        this.configurations.push(config);
      }
      for (let field in this.configurations) {
        this.appFielslist.push(this.configurations[field]?.fieldsDetails);
      }
      for (let newadd in this.appFielslist) {
        this.displaydbList.push(this.appFielslist[newadd]);
      }
      for (let nextone in this.displaydbList) {
        this.tableFieldsData.push(this.displaydbList[nextone]);
      }
    });
  }

  //accept Butoon
  acceptFunction() {
    this.status = true;
    this.defaultService
      .acceptDuplicatenyId(this.status, this.duplicateId)
      .subscribe((res) => {
        setTimeout(() => {
          this.dialogRef.close(1);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      });
  }

  // Reject Button
  onRejectClickFunction() {
    this.status = false;
    this.defaultService
      .acceptDuplicatenyId(this.status, this.duplicateId)
      .subscribe((res) => {
        setTimeout(() => {
          this.dialogRef.close(2);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      });
  }

  //highlight matches
  highlightMatches(comparedData: any) {
    console.log(comparedData);
    console.log(comparedData[0]);
    for (let i = 0; i < comparedData.length; i++) {
      const fieldColorMap = new Map();
      comparedData[i][i]?.matchedColumns.forEach((column) => {
        console.log("matched columns", column)
        const { tableFields, appFields, colorCode } = column;
        tableFields.forEach((tableField) => {
          fieldColorMap.set(tableField, colorCode);
        });
        appFields.forEach((applicationField) => {
          fieldColorMap.set(applicationField, colorCode);
        });
      });
      this.highLighter.push(fieldColorMap);
    }
  }

  // changeCode(event) {
  //   console.log(event)
  //   console.log('selected code tag', this.selectedCodeTag)
  //   console.log('statuses',this.statuses)
  // }

  // notMatch(appplicationId: string[], dBname: string, status: string, ruleUsed: string, recordId: number) {
  //   console.log("recordid", recordId)
  //   this.Dupdecision.applicationId = appplicationId;
  //   this.Dupdecision.category = status;
  //   this.Dupdecision.recordId = recordId;
  //   this.Dupdecision.tag = this.selectedCodeTag.toString();

  //   if (this.selectedNavigation == "NTB_T24_VERIFICATION") {
  //     this.Dupdecision.tableName == "LOS_DUP_T24_ADDRESS";
  //   } else {
  //     this.Dupdecision.tableName = dBname;
  //   }
  //   this.duplicateService.manualDecisionmultirow(this.Dupdecision).subscribe((res) => {
  //     console.log("notmatch res", res);
  //   });
  //   // console.log('STATUSES', this.statuses);
  //   // console.log('DUPDECISION', this.Dupdecision)
  // }

  notMatchs(i: number, j: number, value: string, appplicationId: string[], dBname: string, recordId: number) {
    this.Dupdecision.applicationId = appplicationId;
    this.Dupdecision.category = value;
    this.Dupdecision.recordId = recordId;
    this.Dupdecision.tag = this.selectedOptionsArray[i][j];
    this.statusArray[i][j] = value;
    console.log(this.statusArray)
    if (this.selectedNavigation == "NTB_T24_VERIFICATION") {
      this.Dupdecision.tableName == "LOS_DUP_T24_ADDRESS";
    } else {
      this.Dupdecision.tableName = dBname;
    }
    this.duplicateService.manualDecisionmultirow(this.Dupdecision).subscribe((res) => {
      console.log("notmatch res", res);
    });
  }

  exactMatchs(i: number, j: number, value: string, appplicationId: string[], dBname: string, recordId: number) {
    this.Dupdecision.applicationId = appplicationId;
    this.Dupdecision.category = value;
    this.Dupdecision.recordId = recordId;
    this.Dupdecision.tag = this.selectedOptionsArray[i][j];
    this.statusArray[i][j] = value;
    console.log(this.statusArray)
    if (this.selectedNavigation == "NTB_T24_VERIFICATION") {
      this.Dupdecision.tableName == "LOS_DUP_T24_ADDRESS";
    } else {
      this.Dupdecision.tableName = dBname;
    }
    this.duplicateService.manualDecisionmultirow(this.Dupdecision).subscribe((res) => {
      console.log("notmatch res", res);
    });
    console.log(this.statusArray)
  }

  unVerifieds(i: number, j: number, value: string, appplicationId: string[], dBname: string, recordId: number) {
    this.Dupdecision.applicationId = appplicationId;
    this.Dupdecision.category = value;
    this.Dupdecision.recordId = recordId;
    this.Dupdecision.tag = this.selectedOptionsArray[i][j];
    this.statusArray[i][j] = value;
    console.log(this.statusArray)
    if (this.selectedNavigation == "NTB_T24_VERIFICATION") {
      this.Dupdecision.tableName == "LOS_DUP_T24_ADDRESS";
    } else {
      this.Dupdecision.tableName = dBname;
    }
    this.duplicateService.manualDecisionmultirow(this.Dupdecision).subscribe((res) => {
      console.log("notmatch res", res);
    });
    console.log(this.statusArray)
  }


  // exactMatch(appplicationId: string[], dBname: string, status: string, ruleUsed: string, recordId: number,) {
  //   this.Dupdecision.applicationId = appplicationId;
  //   this.Dupdecision.category = status;
  //   this.Dupdecision.recordId = recordId;
  //   this.Dupdecision.tag = this.selectedCodeTag.toString()
  //   if (this.selectedNavigation == "NTB_T24_VERIFICATION") {
  //     this.Dupdecision.tableName = "LOS_DUP_T24_ADDRESS";
  //   } else {
  //     this.Dupdecision.tableName = dBname;
  //   }
  //   this.duplicateService.manualDecisionmultirow(this.Dupdecision).subscribe((res) => {
  //     console.log("posiblematch res", res);
  //   });
  //   // console.log('STATUSES', this.statuses);
  //   // console.log('DUPDECISION', this.Dupdecision);
  // }

  // unVerified(appplicationId: string[], dBname: string, status: string, ruleUsed: string, recordId: number,) {
  //   this.Dupdecision.applicationId = appplicationId;
  //   this.Dupdecision.category = status;
  //   this.Dupdecision.tableName = dBname;
  //   this.Dupdecision.recordId = recordId;
  //   this.Dupdecision.tag = this.selectedCodeTag.toString()
  //   this.duplicateService.manualDecisionmultirow(this.Dupdecision).subscribe((res) => {
  //     console.log("unVerified res", res);
  //   });
  // }

  onProceed1() {
    //  this.proceedAll = true;
    this.duplicateService.getmultirowProceed(this.duplicateId).subscribe((res) => {
      console.log(res);
      this.dialogRef.close(0);
    });
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
    console.log('saaaaaa')
    this.actionOpen = true;
    this.actionMode = action;
    this.dialogRef.close();
  }
}

export class Dupdecision {
  applicationId?: string[];
  category?: string;
  tableName: string;
  tag: any;
  recordId?: number;

}
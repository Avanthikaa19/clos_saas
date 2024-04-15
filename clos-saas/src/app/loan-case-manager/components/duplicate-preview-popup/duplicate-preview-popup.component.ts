import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { ConfigService } from 'src/app/loan-application/components/services/config.service';
import { LoanServiceService } from 'src/app/loan-origination/component/loan-processes/service/loan-service.service';

@Component({
  selector: 'app-duplicate-preview-popup',
  templateUrl: './duplicate-preview-popup.component.html',
  styleUrls: ['./duplicate-preview-popup.component.scss']
})
export class DuplicatePreviewPopupComponent implements OnInit {

  duplicateId: any[] = [];
  selectedIndex: number=0;
  tabIndex: any = 0;

  id: number;
  getlocalname;
  appId: any;
  appDetails: any;
  databaseDetail: any;
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
  dbDetails: any;
  collectdb: [] = [];
  multiDB: any[] = [];
  dbItems: any[] = [];
  applicationKey: any;
  matchFound: boolean = false;
  selectedMatTabLabel: any;
  status:boolean;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  selectedId: any;
  tabSelect: boolean=false;
  buttonSelect:boolean;
  loading: boolean = false;
  highLighter:any[]= [];
  tabStatus: any;
  codeTagging:any= ["PF","PB","GC","GD","GG","HF","UU","68","65","99","2V","PASS"];
  applicationList:any;
  Dupdecision:Dupdecision = new Dupdecision();
  selectedCodeTag:any[] = [];
  statuses:any[] = [];
  length: number;
  selectedNavigation:string;
  ruleUsed:string;
  noMatch;
  selectedTabname:string;
  proceedAll:boolean;
  closeBtn:boolean=false;
  hideProceedBtn:boolean=false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DuplicatePreviewPopupComponent>,
    public service: ConfigService,
    private route: ActivatedRoute,
    private duplicateService: DuplicateCheckingService,
    private defaultService: LoanServiceService,
  )
   {
    this.duplicateId = data.popupId
    this.selectedNavigation = data.selectedNavigation;
    this.selectedTabname = data.status;
    this.tabStatus=data.status;
    this.buttonSelect = data.buttonSelectAll;
    this.closeBtn = JSON.parse(localStorage.getItem("closeBtn"));
    this.hideProceedBtn = JSON.parse(localStorage.getItem("ProceedBtn"));
    console.log('closeBtn',this.closeBtn)
    if(this.selectedTabname == 'notMatch'){
      this.hideProceedBtn = true;
     }else if(this.selectedTabname == 'exactMatch'){
      this.hideProceedBtn = true;
     }else if(this.selectedTabname == 'Unverified'){
      this.hideProceedBtn = true;
     }else if(this.selectedTabname == 'verificationInProgress'){
      this.closeBtn = false;
      this.hideProceedBtn = true;
     }else if(this.selectedTabname == 'verificationQueue'){
     }
  }

  ngOnInit(): void {
    this.getAppDetails(this.duplicateId[0]);
    console.log("data", this.duplicateId[0]);
    this.getDatabaseDetails(this.duplicateId[0])
  }

 onCloseClick() {
   if(this.selectedTabname == 'notMatch'){
    this.closeBtn = false;
    this.dialogRef.close(2);
   }else if(this.selectedTabname == 'exactMatch'){
    this.closeBtn = false;
    this.dialogRef.close(3);
   }else if(this.selectedTabname == 'Unverified'){
    this.closeBtn = false;
    this.dialogRef.close(4);
   }else if(this.selectedTabname == 'verificationInProgress'){
    this.closeBtn = true;
    this.hideProceedBtn = false;
    localStorage.setItem("closeBtn", JSON.stringify(this.closeBtn));
    localStorage.setItem("ProceedBtn", JSON.stringify(this.hideProceedBtn));
    this.dialogRef.close(1);
   }else if(this.selectedTabname == 'verificationQueue'){
    this.dialogRef.close(0);
   }
  }

  //TAB CHANGE FUNCTION

  selectTab(event) {
    this.tabSelect=true;
    console.log("selectTabCheck", event)
    this.tabIndex = event.index;
    this.selectedMatTabLabel= event.tab.textLabel;
    console.log("selectTabCheck", this.selectedMatTabLabel);
    this.getAppDetails(this.selectedMatTabLabel);
    this.getDatabaseDetails(this.selectedMatTabLabel)
  };

  //get application details 

  getAppDetails(id: any) {
    this.loading=true;
    this.duplicateService.getAppDetails(id).subscribe(res => {
      this.appDetails = res;
      this.loading=false;
    })
  }

  // get database details

  getDatabaseDetails(id: any) {
    this.duplicateService.getMultiDbdetails(id,this.selectedNavigation).subscribe(res => {
      this.databaseDetail = res;
      this.length = this.databaseDetail.length;
      this.databaseKey = Object.keys(this.databaseDetail)
      this.dbDetails = this.databaseDetail
      for (let duplicate in this.dbDetails) {
        this.noMatch = this.dbDetails[duplicate].finalDecisionStage;
        this.multiDB.push(this.dbDetails[duplicate].recordDetails)
        if(this.dbDetails[duplicate].matchedCategory == 'NOT_MATCHED'){
          this.dbDetails[duplicate].matchedCategory = 'NOT MATCHED'
        }else if(this.dbDetails[duplicate].matchedCategory == 'UNVERIFIED'){
          this.dbDetails[duplicate].matchedCategory = 'UNVERIFIED'
        }
      }
      this.highlightMatches(this.dbDetails)
    })
  }

  //get active rule
  getactiveRule() {
    this.duplicateService.getactiveRule().subscribe(res => {
      this.activeRule = res;
      for (let config of this.activeRule?.configurations) {
        this.configurations.push(config)
      }
      for (let field in this.configurations) {
        this.appFielslist.push(this.configurations[field]?.fieldsDetails)
      }
      for (let newadd in this.appFielslist) {
        this.displaydbList.push(this.appFielslist[newadd])
      }
      for (let nextone in this.displaydbList) {
        this.tableFieldsData.push(this.displaydbList[nextone]);
      }
    })
  }

  //accept Butoon
  acceptFunction(){
    this.status=true;
    this.defaultService.acceptDuplicatenyId(this.status, this.duplicateId).subscribe(res=>{
      setTimeout(() => {
        this.dialogRef.close(1);
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      });
    })
  }

  //Reject Button 
  onRejectClickFunction(){
    this.status=false;
    this.defaultService.acceptDuplicatenyId(this.status, this.duplicateId).subscribe(res=>{
      setTimeout(() => {
        this.dialogRef.close(2);
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      });
    })
  }

  //highlight matches
  highlightMatches(comparedData:any){
    for(let i=0;i<comparedData.length;i++){
      const fieldColorMap = new Map();
      comparedData[i].matchedColumns.forEach((column) => {
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

  notMatch(appplicationId:string,dBname:string,status:string,ruleUsed:string){
    this.Dupdecision.finsurgeId = appplicationId;
    this.Dupdecision.status = status;
    if(this.selectedNavigation == 'NTB_T24_VERIFICATION'){
      this.Dupdecision.fieldName == 'LOS_DUP_T24_ADDRESS'
    }else{
      this.Dupdecision.fieldName = dBname;
    }
    this.duplicateService.manualDecision(this.selectedCodeTag.toString(),this.Dupdecision,ruleUsed,this.selectedNavigation).subscribe(res => {
      console.log('notmatch res',res)
    })
  }

  exactMatch(appplicationId:string,dBname:string,status:string,ruleUsed:string){
    this.Dupdecision.finsurgeId = appplicationId;
    this.Dupdecision.status = status;
    if(this.selectedNavigation == 'NTB_T24_VERIFICATION'){
      this.Dupdecision.fieldName = 'LOS_DUP_T24_ADDRESS'
    }else{
      this.Dupdecision.fieldName = dBname;
    }
    this.duplicateService.manualDecision(this.selectedCodeTag.toString(),this.Dupdecision,ruleUsed,this.selectedNavigation).subscribe(res => {
      console.log('posiblematch res',res)
    })
  }

  unVerified(appplicationId:string,dBname:string,status:string,ruleUsed:string){
    this.Dupdecision.finsurgeId = appplicationId;
    this.Dupdecision.status = status;
    this.Dupdecision.fieldName = dBname;
    this.duplicateService.manualDecision(this.selectedCodeTag.toString(),this.Dupdecision,ruleUsed,this.selectedNavigation).subscribe(res => {
      console.log('unVerified res',res)
    })
  }

  onProceed(applicationId: string, tags: string[], statuses: string[], table: any[]) {
    this.proceedAll = true;
    const entries: Omit<Dupdecision, 'finsurgeId'>[] = [];
    for (let i = 0; i < table.length; i++) {  
      const entry: Omit<Dupdecision, 'finsurgeId'> ={
        status: statuses[i],
        fieldName: table[i].tableName,
        tag: tags[i]
      };
      entries.push(entry);
    } 
    this.duplicateService.getProceed(applicationId, entries).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close();
      }
    );
  }
  
}  

export class Dupdecision{
  finsurgeId:string;
  status:string;
  fieldName:string;
  tag: string
}
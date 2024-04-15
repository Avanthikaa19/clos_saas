import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ApplicationDetails } from '../../../models/clos';
import { ApplicationEntryService } from '../service/application-entry.service';
import { ApplicationEntryComponent } from '../application-entry.component';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { PageData } from 'src/app/c-los/models/clos-table';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-risk-compliance-details',
  templateUrl: './risk-compliance-details.component.html',
  styleUrls: ['./risk-compliance-details.component.scss']
})
export class RiskComplianceDetailsComponent implements OnInit {
  appId:number;
  riskValue=['Yes', 'No'];
  udfFieldName: any;
  selectedUdfFieldName: any;
  matchingField:any;
  selectedFieldNames: string[] = [];
  filteredLoanList:any[];
  loanConfigList: any[] = [];
  page: number = 1;
  pageData: PageData;
  selectedField:any;
  userCustomFields: UserDefinedCustomFields = new UserDefinedCustomFields();
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  userCustomFields1: UserDefinedCustomFields[] = [];
  isData:boolean=false;
  action: string;
  loading:boolean = false;
  currentDate = new Date().toISOString().split('T')[0];

  constructor(
    private applicationEntryService: ApplicationEntryService,
    private applicationEntryComponent: ApplicationEntryComponent,
    public closService:CLosService,
    public encryptDecryptService: EncryptDecryptService,
    private cdr: ChangeDetectorRef,
    public dupliateService: DuplicateCheckingService,
    public router: Router,
    ) {
      // this.applicationEntryService.userCustomFields = [];
      // this.applicationEntryService.selectedRiskCompilanceValues = '';
      // this.applicationEntryService.selectedRiskCompilanceNames = [];
      this.pageData = new PageData();
      this.pageData.currentPage = 1;
      this.pageData.pageSize = 20;
      this.userCustomFields1 = [];
      let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
      this.appId = +decryptId;
      if (Object.keys(this.applicationEntryService.applicationDetails).length===0 && this.appId) {
        this.getDataById(); 
       }
      if(this.applicationEntryService.selectedRiskCompilanceNames){
        this.selectedFieldNames = this.applicationEntryService.selectedRiskCompilanceNames;
      }
      if(this.applicationEntryService.selectedRiskCompilanceValues){
        this.userCustomFields1 = this.applicationEntryService.selectedRiskCompilanceValues;
      }
      this.action = this.closService.getAction();
      if(this.action === 'ADDITIONAL_LOAN'){
        this.getAdditionalLoanDetails();
      }
    }

  ngOnInit(): void {
    // Retrieve saved values from the service if needed
    this.applicationDetails = this.applicationEntryService.applicationDetails;
    this.applicationEntryComponent.goToNextStep();
    this.applicationEntryComponent.goToPreviousStep();    
     this.getUdfConfigDetails();
     this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
           if (e.url === '/application-entry/application-view') {
          this.applicationEntryService.userCustomFields = [];
          this.applicationEntryService.selectedRiskCompilanceValues = '';
          this.applicationEntryService.selectedRiskCompilanceNames = [];
          this.userCustomFields1 = [];
        }
      }
    });
    if (this.userCustomFields1.length === 0 && this.appId) {
      this.getCustomFields();
    }
    }
  
    getDataById() {
      this.loading = true;
      this.closService.getApplicationDetailsByID(this.appId).subscribe(
        res => {
          this.loading = false;
          console.log("set",this.applicationDetails,this.appId,this.applicationEntryService.isData ) 
          this.applicationDetails = res;
          this.applicationEntryService.isData=true;
          for (let key in res) {
            if (typeof res[key] === 'number') {
              this.applicationDetails[key] = res[key].toLocaleString();
            }
          }
          if (this.action === 'ROLL_OVER' || this.action === 'EXTENSION_OF_LOAN') {
            res['id'] = null;
            res['applicationId'] = null;
            this.appId = null;
            delete res['applicationResult'];
          }
          this.cdr.detectChanges();
          console.log(res)
        }
      )
    }

  ngOnDestroy(){
    this.applicationEntryService.isData=false 
  }
  preventLetterE(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === 'E') {
    event.preventDefault();
  }
}
  saveApplicationData() {
    this.applicationEntryService.applicationDetails = this.applicationDetails;
  }
  nexttab(){
    this.applicationEntryComponent.goToNextStep();
      }
  previoustab(){
    this.applicationEntryComponent.goToPreviousStep();
  }
  OnSubmitBtnClick(){
    
    this.closService.saveApplication(this.applicationDetails).subscribe(
      res=>{
      console.log(res);
    })
  }

  // To restrict numbers
  restrictToLetters(event: any, propertyName: string) {
    const input = event.target;
    const value = input.value;
    const newValue = value.replace(/[^a-zA-Z]/g, '');
    input.value = newValue;
    this.applicationDetails[propertyName] = newValue;
  } 

  fieldValuechecking() {
    this.applicationEntryService.selectedRiskCompilanceValues = this.userCustomFields1;
  }

  // add custom fields
  addInputField() {
    if (this.selectedUdfFieldName && !this.selectedFieldNames.includes(this.selectedUdfFieldName)) {
      this.applicationEntryService.selectedRiskCompilanceNames.push(this.selectedUdfFieldName);
      this.matchingField = this.loanConfigList.find(item => item.fieldName === this.selectedUdfFieldName);
      if (this.matchingField) {
        const newCustomField: UserDefinedCustomFields = {
          appId: null,
          fieldName: this.matchingField.fieldName,
          fieldType: this.matchingField.fieldType,
          fieldValue: '',
          tab: this.matchingField.tab,
          subTab: this.matchingField.subTab,
          dateFormat: 'yyyy-MM-dd',
          module: this.matchingField.module
        };
        this.userCustomFields1.push(newCustomField);
        console.log(this.userCustomFields1);
        this.applicationEntryService.addUserCustomField(newCustomField);
      }
      this.selectedUdfFieldName = '';
    }
  }
  
 // List udf
 getUdfConfigDetails(){
  this.dupliateService.getUserDefine(this.pageData.currentPage, 100).subscribe(
  res =>{
    console.log(res);
    this.loanConfigList = res['data'].filter(item => {
      return item.tab === 'Risk and Compliance';
    });
    this.selectedField = this.loanConfigList.map(item => item.fieldName);
      this.pageData.totalRecords = res['count'];
  }
)
}

getFieldType(fieldName: string): string {
  if (this.loanConfigList) {
    const matchingField = this.loanConfigList.find(item => item.fieldName === fieldName);
    return matchingField ? matchingField.fieldType : 'text';
  } else {
    return 'text'; 
  }
}

// To remove input
removeInput(index: number) {
  this.selectedFieldNames.splice(index, 1);
}

  // get custom udf
  getCustomFields() {
    if (this.userCustomFields1.length > 0) {
      return;
    }
    if(this.appId){
    this.closService.getCustomFields(this.appId,'Risk and Compliance','').subscribe(
      (res :any) => {
        console.log(res);
        this.userCustomFields1 = res;
        res.forEach(item => {
          if(!this.selectedFieldNames.includes(item.fieldName)) {
            this.selectedFieldNames.push(item.fieldName)
          }
        });         
      this.applicationEntryService.selecteFieldValues = this.userCustomFields1;
      }
    );
  }
}
getAdditionalLoanDetails(){
  this.applicationDetails.parentId = this.closService.getFsIds();
  this.closService.getAdditionalLoan(this.applicationDetails.parentId).subscribe(
    res => {
      console.log(res)
      this.applicationDetails = res;
    }
  )
}
}

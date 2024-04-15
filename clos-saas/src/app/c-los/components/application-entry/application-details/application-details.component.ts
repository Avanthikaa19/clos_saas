import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApplicationDetails } from '../../../models/clos';
import { ApplicationEntryService } from '../service/application-entry.service';
import { ApplicationEntryComponent } from '../application-entry.component';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { Attachment, PageData } from 'src/app/c-los/models/clos-table';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})
export class ApplicationDetailsComponent implements OnInit {
  loanType: string[] = ['Term Loan', 'Working Capital Loan', 'Revolving Credit Lines', 'Equipment Financing', 'Commercial Real Estate Loan', 'Invoice Financing', 'Trade Finance', 'Bridge Loan', 'Mezzanine Loan', 'Debt Consolidation Loan',  'Acquisition Loan', 'Startup Loan', 'Project Finance']
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  files: File[] = [];
  appId:number;
  udfFieldName: any;
  selectedUdfFieldName: any;
  matchingField:any;
  selectedFieldNames: string[] = [];
  filteredLoanList:any[];
  loanConfigList: any[] = [];
  page: number = 1;
  pageData: PageData;
  selectedField:any;
  loading:boolean = false;
  userCustomFields: UserDefinedCustomFields = new UserDefinedCustomFields();
  userCustomFields1: UserDefinedCustomFields[] = [];
  action: string;
  currentDate = new Date().toISOString().split('T')[0];

  constructor(
    private applicationEntryService: ApplicationEntryService,
    private applicationEntryComponent: ApplicationEntryComponent,
    private closService: CLosService,
    public encryptDecryptService: EncryptDecryptService,
    private cdr: ChangeDetectorRef,
    public dupliateService: DuplicateCheckingService,
    public router: Router,

  ) {
    this.userCustomFields1 = [];
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
    let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
    this.appId = +decryptId;
    if (Object.keys(this.applicationEntryService.applicationDetails).length===0 && this.appId) {
      this.getDataById(); 
     }
     if(this.applicationEntryService.selectedApplicationNames){
      this.selectedFieldNames = this.applicationEntryService.selectedApplicationNames;
    }
    if(this.applicationEntryService.selectedApplicationValues){
      this.userCustomFields1 = this.applicationEntryService.selectedApplicationValues;
    }
    this.action = this.closService.getAction();
    if(this.action === 'ADDITIONAL_LOAN'){
      this.getAdditionalLoanDetails();
    }
  }

  ngOnInit(): void {
    this.applicationDetails = this.applicationEntryService.applicationDetails;
    this.applicationEntryComponent.goToNextStep();
    this.applicationEntryComponent.goToPreviousStep();
    this.getUdfConfigDetails();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
           if (e.url === '/application-entry/application-view') {
          this.applicationEntryService.userCustomFields = [];
          this.applicationEntryService.selectedApplicationValues = '';
          this.applicationEntryService.selectedApplicationNames = [];
          this.userCustomFields1 = [];
        }
      }
    });  
  if (this.userCustomFields1.length === 0 && this.appId) {
    this.getCustomFields();
  }    
  }

  saveApplicationData() {
    this.applicationEntryService.applicationDetails = this.applicationDetails;
  }

  getDataById() {
    this.loading = true;
    this.closService.getApplicationDetailsByID(this.appId).subscribe(
      res => {
        this.applicationDetails = res;
        this.loading = false;
        if (this.action === 'ROLL_OVER' || this.action === 'EXTENSION_OF_LOAN') {
          res['id'] = null;
          res['applicationId'] = null;
          this.appId = null;
          delete res['applicationResult'];
        }
        for (let key in res) {
          if (typeof res[key] === 'number' && !this.applicationDetails['contactNumber']) {
            this.applicationDetails[key] = res[key].toLocaleString();
          }
        }
        this.cdr.detectChanges();
      }
    )
  }
  nextstep() {
    this.applicationEntryComponent.goToNextStep();
    this.enableSixthTab();
  }

  enableSixthTab() {
    this.closService.setEnableSixthTab(true);
  }

  disable() {
    if (!this.applicationDetails.applicantName || !this.applicationDetails.entityName || !this.applicationDetails.designation || !this.applicationDetails.companyId
      || !this.applicationDetails.dob) {
      return false;
    }
    else {
      return true;
    }
  }

  errMsg() {
    if (!this.applicationDetails.applicantName) {
      return '* Applicant Name is a required field';
    }
    if (!this.applicationDetails.entityName) {
      return '* Entity Name is a required field';
    }
    if (!this.applicationDetails.designation) {
      return '* Designation is a required field';
    }
    if (!this.applicationDetails.companyId) {
      return '* Company ID is a required field';
    }
    if (!this.applicationDetails.dob) {
      return '* Date of Birth is a required field';
    }
    // if (!this.applicationDetails.typesOfLoan) {
    //   return '* Type of Loan is a required field';
    // }
    
    

    return ''
  }

  // To calculate age 
  calculateAge() {
    const dobDate = new Date(this.applicationDetails.dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    if (currentDate.getMonth() < dobDate.getMonth() || (currentDate.getMonth() === dobDate.getMonth() && currentDate.getDate() < dobDate.getDate())) {
      this.applicationDetails.age = age - 1;
    } else {
      this.applicationDetails.age = age;
    }
  }

  // To upload signature
  onFilesSelected(event: any, field: string) {
    this.files = event.target.files;
    this.uploadAttachments(field);
  }

  formFileResponseData(attachmentName: string, attachmentId: number) {
    let attachmentResponse = new Attachment()
    attachmentResponse.attachmentId = attachmentId;
    attachmentResponse.attachmentName = attachmentName;
    return attachmentResponse
  }

  uploadAttachments(field: string) {
    for (let i = 0; i < this.files.length; i++) {
      this.closService.uploadAttachment(this.files[i]).subscribe(
        res => {
        if (field === 'applicantSignature') {
          if (!this.applicationDetails.applicantSignature) {
            this.applicationDetails.applicantSignature = [];
          }
          const response = this.formFileResponseData(res.attachmentName, res.attachmentId);
          this.applicationDetails.applicantSignature.push(response);
          this.cdr.detectChanges();
        }
      }
     
    )
    this.saveApplicationData();
  }
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
  preventLetterE(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }
  removeAttachment(type: string, index: number,) {
    if (type == 'applicantSignature') {
      this.applicationDetails.applicantSignature.splice(index, 1)
    }
  }

  previoustab() {
    this.applicationEntryComponent.goToPreviousStep();
  }
  
  // add custom fields
  addInputField() {
    if (this.selectedUdfFieldName && !this.selectedFieldNames.includes(this.selectedUdfFieldName)) {
      this.applicationEntryService.selectedApplicationNames.push(this.selectedUdfFieldName);
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
      return item.tab === 'Applicant details';
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

fieldValuechecking() {
  this.applicationEntryService.selectedApplicationValues = this.userCustomFields1;
}

  // get custom udf
  getCustomFields() {
    if (this.userCustomFields1.length > 0) {
      return;
    }
    if(this.appId){
    this.closService.getCustomFields(this.appId,'Applicant details','').subscribe(
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

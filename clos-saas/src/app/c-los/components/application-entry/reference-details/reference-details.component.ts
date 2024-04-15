import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ApplicationDetails } from '../../../models/clos';
import { ApplicationEntryService } from '../service/application-entry.service';
import { ApplicationEntryComponent } from '../application-entry.component';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { Attachment, PageData } from 'src/app/c-los/models/clos-table';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.scss']
})
export class ReferenceDetailsComponent implements OnInit {
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
  userCustomFields1: UserDefinedCustomFields[] = [];
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  appId:number;
  loanType: string[] = ['Term Loan', 'Working Capital Loan', 'Revolving Credit Lines', 'Equipment Financing', 'Commercial Real Estate Loan', 'Invoice Financing', 'Trade Finance', 'Bridge Loan', 'Mezzanine Loan', 'Debt Consolidation Loan',  'Acquisition Loan', 'Startup Loan', 'Project Finance']
  files: File[] = [];
  action: string;
  loading:boolean = false;
  currentDate = new Date().toISOString().split('T')[0];

  constructor(private applicationEntryService: ApplicationEntryService,
    private applicationEntryComponent: ApplicationEntryComponent,
    public closService:CLosService,
    public encryptDecryptService: EncryptDecryptService,
    private cdr: ChangeDetectorRef,
    public dupliateService: DuplicateCheckingService,
    public router: Router,
    ) { 
      this.userCustomFields1 = [];
      let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
    this.appId = +decryptId;
    if (Object.keys(this.applicationEntryService.applicationDetails).length===0 && this.appId) {
      this.getDataById(); 
     }   
      // INITIALIZING PAGEDATA
      this.pageData = new PageData();
      this.pageData.currentPage = 1;
      this.pageData.pageSize = 10;
      if(this.applicationEntryService.selectedReferenceNames){
        this.selectedFieldNames = this.applicationEntryService.selectedReferenceNames;
      }
      if(this.applicationEntryService.selectedReferenceValues){
        this.userCustomFields1 = this.applicationEntryService.selectedReferenceValues;
      }  
      this.action = this.closService.getAction();
      if(this.action === 'ADDITIONAL_LOAN'){
        this.getAdditionalLoanDetails();
      }
  }
    getDataById() {
      this.loading = true;
      this.closService.getApplicationDetailsByID(this.appId).subscribe(
        res => {
          this.applicationDetails = res;
          this.loading = false;
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
  ngOnInit(): void {
    this.applicationDetails = this.applicationEntryService.applicationDetails;
    this.applicationEntryComponent.goToNextStep();
    this.applicationEntryComponent.goToPreviousStep();
    this.getUdfConfigDetails();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
           if (e.url === '/application-entry/application-view') {
          this.applicationEntryService.userCustomFields = [];
          this.applicationEntryService.selectedReferenceValues = '';
          this.applicationEntryService.selectedReferenceValues = [];
          this.userCustomFields1 = [];
        }
      }
    });
    if (this.userCustomFields1.length === 0 && this.appId) {
      this.getCustomFields();
    }
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
    this.enableSeventhTab();
      }
      enableSeventhTab() {
        this.closService.setEnableSecondTab(true);
      }
  previoustab(){
    this.applicationEntryComponent.goToPreviousStep();
  }

  onFilesSelected(event: any, field: string) {
    this.files = event.target.files;
    this.uploadAttachments(field)
  }

  formFileResponseData(attachementName: string, attachmentId: number) {
    let attachmentResponse = new Attachment()
    attachmentResponse.attachmentId = attachmentId;
    attachmentResponse.attachmentName = attachementName;
    return attachmentResponse
  }

  uploadAttachments(field: string) {
    for (let i = 0; i < this.files.length; i++) {
      this.closService.uploadAttachment(this.files[i]).subscribe(
        res => {
          if (field == 'vendorsAgreement') {
            if (!this.applicationDetails.vendorsAgreement) {
              this.applicationDetails.vendorsAgreement = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.applicationDetails.vendorsAgreement.push(response)
            this.cdr.detectChanges();
          }
          if (field == 'suppliersAgreement') {
            if (!this.applicationDetails.suppliersAgreement) {
              this.applicationDetails.suppliersAgreement = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.applicationDetails.suppliersAgreement.push(response)
            this.cdr.detectChanges();
          }
          if (field == 'partnersAgreement') {
            if (!this.applicationDetails.partnersAgreement) {
              this.applicationDetails.partnersAgreement = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.applicationDetails.partnersAgreement.push(response)
            this.cdr.detectChanges();
          }
        }
      )
    }
    this.saveApplicationData()
  }
  removeAttachment(type: string, index: number,) {
    if (type == 'vendorsAgreement') {
      this.applicationDetails.vendorsAgreement.splice(index, 1)
    }
    else if (type == 'suppliersAgreement') {
      this.applicationDetails.suppliersAgreement.splice(index, 1)
    }
    else if (type == 'partnersAgreement') {
      this.applicationDetails.partnersAgreement.splice(index, 1)
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

    // add custom fields
    addInputField() {
      if (this.selectedUdfFieldName && !this.selectedFieldNames.includes(this.selectedUdfFieldName)) {
        this.applicationEntryService.selectedReferenceNames.push(this.selectedUdfFieldName);
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
          console.log(this.userCustomFields1)
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
        return item.tab === 'Reference';
      });
      console.log(this.loanConfigList)
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
    this.applicationEntryService.selectedReferenceValues = this.userCustomFields1;    
  }
  
    // get custom udf
    getCustomFields() {
      if (this.userCustomFields1.length > 0) {
        return;
      }      
      if(this.appId){
      this.closService.getCustomFields(this.appId,'Reference','').subscribe(
        (res :any) => {
          this.userCustomFields1 = res;
          res.forEach(item => {
            if(!this.selectedFieldNames.includes(item.fieldName)) {
              this.selectedFieldNames.push(item.fieldName)
            }
          }); 
          this.applicationEntryService.selectedReferenceValues = this.userCustomFields1;
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

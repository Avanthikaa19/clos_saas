import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApplicationDetails, ExtensionOfLoanDetails, RolloverDetails } from '../../../models/clos';
import { ApplicationEntryService } from '../service/application-entry.service';
import { ApplicationEntryComponent } from '../application-entry.component';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { Attachment, PageData } from 'src/app/c-los/models/clos-table';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss']
})
export class LoanDetailsComponent implements OnInit {
  udfFieldName: any;
  selectedUdfFieldName: any;
  matchingField:any;
  selectedFieldNames: string[] = [];
  filteredLoanList:any[];
  loanConfigList: any[] =[];
  page: number = 1;
  pageData: PageData;
  selectedField:any;
  userCustomFields: UserDefinedCustomFields = new UserDefinedCustomFields();
  purposeOfLoan: string[]=['Bills / Utlitize payment', 'Payment of salaries / Allowance', 'Investment proceeds','Rental Payments','Business','Rental Proceeds','Remittances / Payments Transfer','Others'];
  sourceOfLoan: string[]=['Rental Proceeds', 'Investments','Foreign Investment Proceeds', 'Capital Gain from sales of Assets','Business Proceeds','Retirement Funds','Political Funds','Donation','Membership Fees Collected','Charity Collections received from Donors Proceeds from Credit Facility','Family / Internal Funding from Relatives','Others'];
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  appId:number;
  userCustomFields1: UserDefinedCustomFields[] = [];
  currency: string[] = [];
  searchCurrency: string = '';
  currencyList: string[] = [];
  loading:boolean = false;
  rolloverdetails: RolloverDetails = {
    newLoanTerm: 0,
    newInterestRate: 0,
    reason: '',
    maturityDate: undefined,
    rollOverFee: 0,
    history: [],
    applicationId: 0,
    proposedFrequency: '',
    additionalDocuments: [],
    additionalDocumentsComments: ''
  };
  files: File[] = [];
  frequency: string[]=['Yearly','Half-Yearly','Quaterly','Monthly','Weekly','Daily'] 
  term:string[]=['Fixed','Float']
  extensionofloandetails: ExtensionOfLoanDetails = {
    newLoanAgreement: [],
    newInterestRate: 0,
    reason: '',
    requestedExtensionTerm: undefined,
    applicationId:null,
    extensionFee: 0
  };
  action:string;
  correspondingId:number | null;
  currentDate = new Date().toISOString().split('T')[0];

  constructor(private applicationEntryService: ApplicationEntryService,
    public dupliateService: DuplicateCheckingService,
    private applicationEntryComponent: ApplicationEntryComponent,
    private closService: CLosService,
    public encryptDecryptService: EncryptDecryptService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    ) {
      this.userCustomFields1 = [];
      this.pageData = new PageData();
      this.pageData.currentPage = 1;
      this.pageData.pageSize = 20;
      this.correspondingId =  this.applicationEntryService.getGeneratedId();
      console.log(this.correspondingId)
      let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
    this.appId = +decryptId;
    if (Object.keys(this.applicationEntryService.applicationDetails).length===0 && this.appId) {
      this.getDataById(); 
     }   
     if (Object.keys(this.applicationEntryService.rollOverDetails).length===0 && this.appId) {
      this.getRolloverDetails();
     }
     if (Object.keys(this.applicationEntryService.extensionloandetails).length===0 && this.appId) {
      this.getExtensionofloanDetails();
     }
     if(this.applicationEntryService.selectedLoanlFieldNames){
      this.selectedFieldNames = this.applicationEntryService.selectedLoanlFieldNames;
    }
    if(this.applicationEntryService.selecteLoanValues){
      this.userCustomFields1 = this.applicationEntryService.selecteLoanValues;
    }
  }
  getDataById() {
    this.loading = true;
    this.closService.getApplicationDetailsByID(this.appId).subscribe(
      res => {
        this.loading = false;
        this.applicationDetails = res;
        for (let key in res) {
          if (typeof res[key] === 'number' && key != 'loanAmount') {
            this.applicationDetails[key] = res[key].toLocaleString();
          }
        }
        if (this.action === 'ROLL_OVER' || this.action === 'EXTENSION_OF_LOAN') {
          res['id'] = null;
          res['applicationId'] = null;
          this.appId = null;
          delete res['applicationResult'];
        }
        console.log(res)
      }
    )
  }
  ngOnInit(): void {
    // Retrieve saved values from the service if needed
    this.action = this.closService.getAction();
    this.applicationDetails = this.applicationEntryService.applicationDetails;
    this.rolloverdetails = this.applicationEntryService.rollOverDetails;
    this.extensionofloandetails = this.applicationEntryService.extensionloandetails;
    this.applicationEntryComponent.goToNextStep();
    this.applicationEntryComponent.goToPreviousStep();
    this.getUdfConfigDetails();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
           if (e.url === '/application-entry/application-view' || e.url === '/home') {
          this.applicationEntryService.userCustomFields = [];
          this.applicationEntryService.selecteLoanValues = '';
          this.applicationEntryService.selectedLoanlFieldNames = [];
          this.userCustomFields1 = [];
          this.applicationEntryService.rollOverDetails = {} as RolloverDetails;
          this.applicationEntryService.extensionloandetails = {} as ExtensionOfLoanDetails;
        }
      }
    });
    this.getCountryAndCurrency();
    if(this.appId){
    this.dupliateService.selectedCountry$.subscribe((selectedCountry) => {
      if (selectedCountry) {
        this.dupliateService.getCurrencyByCountry().subscribe((res) => {
          const uniqueCurrencies = new Set(Object.values(res));
          this.currency = Array.from(uniqueCurrencies);
          this.currencyList = this.currency;
          this.applicationDetails.loanCurrency = res[selectedCountry] || '';
        });
      }
    });
  }
 
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
    this.enableFourthTab()
  }
 
  enableFourthTab() {
    this.closService.setEnableFourthTab(true);
  }
  previoustab(){
    this.applicationEntryComponent.goToPreviousStep();
  }

  disable() {
    if (!this.applicationDetails.loanAmount || !this.applicationDetails.loanCurrency) {
      return false;
    }
    else {
      return true;
    }

  }
  errMsg() {
    if (!this.applicationDetails.loanAmount) {
      return '* Loan Amount is a required field';
    }
    if (!this.applicationDetails.loanCurrency) {
      return '* Loan Currency required field';
    }
    return ''
  }

  // add custom fields
  addInputField() {
    if (this.selectedUdfFieldName && !this.selectedFieldNames.includes(this.selectedUdfFieldName)) {
      this.applicationEntryService.selectedLoanlFieldNames.push(this.selectedUdfFieldName);
      // this.applicationEntryService.selecteLoanValues = this.userCustomFields.fieldValue;
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
      return item.tab === 'Loan Details';
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
  this.applicationEntryService.selecteLoanValues = this.userCustomFields1;    
}

  // get custom udf
  getCustomFields() {
    if (this.userCustomFields1.length > 0) {
      return;
    }
    if(this.appId ){
    this.closService.getCustomFields(this.appId,'Loan Details','').subscribe(
      (res :any) => {
        this.userCustomFields1 = res;
        res.forEach(item => {
          if(!this.selectedFieldNames.includes(item.fieldName)) {
            this.selectedFieldNames.push(item.fieldName)
          }
        }); 
        this.applicationEntryService.selecteLoanValues = this.userCustomFields1;        
      }
    );
  }
}
// get currency dropdown
getCountryAndCurrency() {
  this.dupliateService.getCurrencyByCountry().subscribe(
    res => {
      const uniqueCurrencies = new Set(Object.values(res));
      this.currency = Array.from(uniqueCurrencies);
      this.currencyList = this.currency;
    }
  )
}

// search currency dropdown
onCurrencyFilter() {
  if (this.searchCurrency) {
    const filteredCurrency = this.currencyList.filter(table => table.toLowerCase().includes(this.searchCurrency.toLowerCase()));
    this.currency = filteredCurrency;
  } else {
    this.currency = this.currencyList;
  }
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
        console.log("Field : {}", field)
        if (field == 'history') {
          if (!this.rolloverdetails.history) {
            this.rolloverdetails.history = []
          }
          let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
          this.rolloverdetails.history.push(response);
          this.cdr.detectChanges();
        }
        else if (field == 'newLoanAgreement') {
          if (!this.extensionofloandetails.newLoanAgreement) {
            this.extensionofloandetails.newLoanAgreement = []
          }
          let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
          this.extensionofloandetails.newLoanAgreement.push(response)
          this.cdr.detectChanges();
        }
        else{
          console.log("File ...... : ",field)
          if (!this.rolloverdetails.additionalDocuments) {
            this.rolloverdetails.additionalDocuments = []
          }
          let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
          this.rolloverdetails.additionalDocuments.push(response)
          this.cdr.detectChanges();
        }
      }
    )
  }
}
removeAttachment(type: string, index: number,) {
  if (type == 'history')
    this.rolloverdetails.history.splice(index, 1)
  else if (type == 'newLoanAgreement') {
      this.extensionofloandetails.newLoanAgreement.splice(index, 1)
    }
  else{
    this.rolloverdetails.additionalDocuments.splice(index, 1)
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

// To store rollover service 
saveLoanRollover() {
  this.applicationEntryService.rollOverDetails = this.rolloverdetails;
}

// To store extension service 
saveExtensionLoan() {
  this.applicationEntryService.extensionloandetails = this.extensionofloandetails;
}

// get roll over details
getRolloverDetails(){
  this.closService.getrollOverDetails(this.appId,1,10).subscribe(
    res => {
      console.log(res);
      if (res.data && res.data.length > 0) {
        this.rolloverdetails = res.data[0];
      }
    }
  )
}
// get extension details
getExtensionofloanDetails(){
  this.closService.getextensionOfLoanDetails(this.appId,1,10).subscribe(
    res => {
      console.log(res);
      if (res.data && res.data.length > 0) {
        this.extensionofloandetails = res.data[0];
      }
    }
  )
}
}

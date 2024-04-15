import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ApplicationDetails, Collaterals } from '../../../models/clos';
import { ApplicationEntryService } from '../service/application-entry.service';
import { ApplicationEntryComponent } from '../application-entry.component';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { Attachment, PageData } from 'src/app/c-los/models/clos-table';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-collateral-details',
  templateUrl: './collateral-details.component.html',
  styleUrls: ['./collateral-details.component.scss']
})
export class CollateralDetailsComponent implements OnInit {
  collateralTableHeader = ['Collateral Amount', 'Collateral Value', 'Collateral Currency', 'Collateral Type', 'Market Value', 'Collateral Asset', 'Collateral Description', 'Collateral Category', 'Haircut', 'Loan to Value Ratio', 'Collateral Documents', 'Remarks']
  files: File[] = [];
  collateralheaders: Collaterals[] = [new Collaterals()];
  appId: number;
  udfFieldName: any;
  selectedUdfFieldName: any;
  matchingField: any;
  selectedFieldNames: string[] = [];
  filteredLoanList: any[];
  loanConfigList: any[] = [];
  page: number = 1;
  pageData: PageData;
  selectedField: any;
  userCustomFields: UserDefinedCustomFields = new UserDefinedCustomFields();
  userCustomFields1: UserDefinedCustomFields[] = [];
  collateralCategory: string[] = [];
  action: string;
  loading:boolean = false;
  currentDate = new Date().toISOString().split('T')[0];

  // [
  //   'Real Estate',
  //   'Residential Properties',
  //   'Machinery and Equipment',
  //   'Inventory',
  //   'Accounts Receivable',
  //   'Vehicles',
  //   'Investment Porfolios',
  //   'Cash or Cash Equivalents',
  //   'Intellectual Property',
  //   'Business Assets',
  //   'Accounts or Contracts',
  //   'Personal Guarantees',
  //   'Life Insurance Policies',
  //   'Art and Collectibles',
  //   'Raw Materials'];
  collateralType: string[][] = [];
  // [
  //   'Commercial Property', 'Residential Property', 'Industrial Property', 'Machinery', 'Vehicles', 'Office Equipment', 'Stocks', 'Bonds', 'Other'
  // ]
  coverType: string[] = [
    'property insurance',
    'liability insurance',
    'equipment insurance',
    'life insurance',
    'health insurance',
    'auto insurance',
    'cyber insurance',
    'other insurance',
  ]
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  collateralsDetails: Collaterals = new Collaterals();
  constructor(private applicationEntryService: ApplicationEntryService, private applicationEntryComponent: ApplicationEntryComponent,
    private closService: CLosService,
    private cdr: ChangeDetectorRef,
    public encryptDecryptService: EncryptDecryptService,
    public dupliateService: DuplicateCheckingService,
    public router: Router,
    public zone: NgZone
  ) {
    this.userCustomFields1 = [];
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 20;
    let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
    this.appId = +decryptId;
    if (Object.keys(this.applicationEntryService.applicationDetails).length === 0 && this.appId) {
      this.getDataById();
    }
    if (this.applicationEntryService.selectedCollateralNames) {
      this.selectedFieldNames = this.applicationEntryService.selectedCollateralNames;
    }
    if (this.applicationEntryService.selectedCollateralValues) {
      this.userCustomFields1 = this.applicationEntryService.selectedCollateralValues;
    }
    if (this.applicationEntryService.collateralsDetails.length) {
      this.collateralheaders = this.applicationEntryService.collateralsDetails;
    }
  }

  ngOnInit(): void {
    // Retrieve saved values from the service if needed
    this.applicationDetails = this.applicationEntryService.applicationDetails;
    this.applicationEntryComponent.goToNextStep();
    this.applicationEntryComponent.goToPreviousStep();
    this.getUdfConfigDetails();  
    this.collateralheaders.forEach(() => {
      this.collateralType.push([]);
    }); 
    this.collateralheaders.forEach((header, index) => {
      this.getCollateralCategory(header.collateralCategory, index);
    });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        if (e.url === '/application-entry/application-view') {
          this.applicationEntryService.userCustomFields = [];
          this.applicationEntryService.selectedCollateralValues = '';
          this.applicationEntryService.selectedCollateralNames = [];
          this.applicationEntryService.collateralsDetails = [];
          this.userCustomFields1 = [];
        }
      }
    });
    this.action = this.closService.getAction();
    if (this.appId) {
      this.getMultipleDetails();
    }
    if (this.userCustomFields1.length === 0 && this.appId) {
      this.getCustomFields();
    }
  }
  getDataById() {
    // this.loading = true;
    this.closService.getApplicationDetailsByID(this.appId).subscribe(
      res => {
        // this.loading = false;
        this.applicationDetails = res;
        if (this.action === 'ROLL_OVER' || this.action === 'EXTENSION_OF_LOAN') {
          res['id'] = null;
          res['applicationId'] = null;
          this.appId = null;
          delete res['applicationResult'];
        }
        for (let key in res) {
          if (typeof res[key] === 'number' && !this.applicationDetails['amount']) {
            this.applicationDetails[key] = res[key].toLocaleString();
          }
        }
        if (!this.applicationDetails) {
          //
        }
        else {
          console.log(this.applicationDetails.typesOfLoan)
          const loantype = this.applicationDetails.typesOfLoan;
          this.closService.getCollateralCategories(loantype,this.applicationDetails.collateralCategory).subscribe(
            res => {
              this.collateralCategory = Array.from(new Set(res.collateralCategory));
              this.collateralType = Array.from(new Set(res.collateralType));
            }
          )
        }
        this.cdr.detectChanges();
        console.log(res)
      }
    )
  }
  preventLetterE(event: KeyboardEvent) {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }
  saveApplicationData() {
    this.applicationEntryService.applicationDetails = this.applicationDetails;

  }
  saveShareHoldersDetails() {
    this.applicationEntryService.collateralsDetails = this.collateralheaders;
    console.log(this.applicationEntryService.collateralsDetails);
  }

  nexttab() {
    this.applicationEntryComponent.goToNextStep();
  }
  previoustab() {
    this.applicationEntryComponent.goToPreviousStep();
  }

  // To upload signature
  onFilesSelected(event: any, field: string) {
    this.files = event.target.files;
    this.uploadAttachments(field)
  }
  onMultipleDetailsFileSelected(event: any, field: string, index: number) {
    console.log('sss')
    this.files = event.target.files;
    this.onMutipleDetailsFileUpload(field, index);
  }

  onMutipleDetailsFileUpload(field: string, index: number) {
    for (let i = 0; i < this.files.length; i++) {
      this.closService.uploadAttachment(this.files[i]).subscribe(
        res => {
          if (field === 'collateralDocuments') {
            if (!this.collateralheaders[index].collateralDocuments) {
              this.collateralheaders[index].collateralDocuments = [];
            }
            const response = this.formFileResponseData(res.attachmentName, res.attachmentId);
            this.collateralheaders[index].collateralDocuments.push(response);
            console.log('hjkl', this.collateralheaders[index].collateralDocuments);
            this.cdr.detectChanges();
          }
        }
      );
    }
    this.saveShareHoldersDetails()
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
          if (field === 'collateralDocuments') {
            if (!this.applicationDetails.collateralDocuments) {
              this.applicationDetails.collateralDocuments = [];
            }
            const response = this.formFileResponseData(res.attachmentName, res.attachmentId);
            this.applicationDetails.collateralDocuments.push(response);
            this.cdr.detectChanges();
          }
          if (field == 'guarantorAgreement') {
            if (!this.applicationDetails.guarantorAgreement) {
              this.applicationDetails.guarantorAgreement = []
            }
            let response = this.formFileResponseData(res.attachmentName, res.attachmentId)
            this.applicationDetails.guarantorAgreement.push(response)
            this.cdr.detectChanges();
          }
        }
      )
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

  removeAttachment(type: string, index: number, j?: number) {
    if (type == 'guarantorAgreement') {
      this.applicationDetails.guarantorAgreement.splice(index, 1)
    }
    if (type == 'collateralDocuments') {
      this.collateralheaders[index].collateralDocuments.splice(j, 1)
    }
  }

  // To restrict  numbers
  restrictNum(event: any, props: string) {
    const input = event.target;
    const value = input.value;
    const newValue = value.replace(/[^a-zA-Z]/g, '');
    input.value = newValue;
    this.applicationDetails[props] = newValue;
  }

  toCalculateRatio(index: number) {
    let amount = this.applicationDetails.loanAmount.toString();
    let marketValue = this.collateralheaders[index].marketValue.toString()
    this.collateralheaders[index].loanToValueRatio = isNaN(parseFloat(amount.replace(/,/g, '')) / parseFloat(marketValue.replace(/,/g, '')) * 100) ? null : ((parseFloat(amount.replace(/,/g, '')) / parseFloat(marketValue.replace(/,/g, ''))) * 100);
  }
  disable() {
    for (const header of this.collateralheaders) {
      if (!header.marketValue) {
        return false; // Disable the button if any marketValue is falsy
      }
    }
    return true; // Enable the button if all marketValue fields are provided
  }
  errMsg() {
    for (const header of this.collateralheaders) {
      if (!header.marketValue) {
        return '* Market Value is a required field';
      }
    }
    return '';
  }
  

  // To add collateral Fields
  addCollateralHeader() {
    this.collateralheaders.push({ ...this.collateralsDetails });
    this.collateralsDetails = new Collaterals();
  }
  removeCollateral(index) {
    this.collateralheaders.splice(index, 1);
  }
  getMultipleDetails() {
    // this.loading = true;
    this.closService.getMultipleDetails(this.appId).subscribe(
      res => {
        if (Object.keys(this.collateralheaders[0]).length === 0) {
          console.log('aaaaaa')
          // this.loading = false;
          this.collateralheaders = res.collateralDetails; 
          for (let i = 0; i < this.collateralheaders.length; i++) {
            const collateralType = this.collateralheaders[i].collateralType;
            const collateralCategory = this.collateralheaders[i].collateralCategory;            
            this.getCollateralCategory(collateralCategory,i);
          }
        }
        this.applicationEntryService.collaterals = res.collateralDetails;
        this.saveApplicationData();
      }
    );
  }

  // add custom fields
  addInputField() {
    if (this.selectedUdfFieldName && !this.selectedFieldNames.includes(this.selectedUdfFieldName)) {
      this.applicationEntryService.selectedCollateralNames.push(this.selectedUdfFieldName);
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
  getUdfConfigDetails() {
    this.dupliateService.getUserDefine(this.pageData.currentPage, 100).subscribe(
      res => {
        this.loanConfigList = res['data'].filter(item => {
          return item.tab === 'Collateral Details';
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
    this.applicationEntryService.selectedCollateralValues = this.userCustomFields1;
  }

  // get custom udf
  getCustomFields() {
    if (this.userCustomFields1.length > 0) {
      return;
    }
    if (this.appId) {
      this.closService.getCustomFields(this.appId, 'Collateral Details', '').subscribe(
        (res: any) => {
          this.userCustomFields1 = res;
          res.forEach(item => {
            if (!this.selectedFieldNames.includes(item.fieldName)) {
              this.selectedFieldNames.push(item.fieldName)
            }
          });
          this.applicationEntryService.selecteFieldValues = this.userCustomFields1;
        }
      );
    }

  }

  getCollateralCategory(collateral:string,index:number) {
    if(!collateral){
      collateral = null;
    }
    this.closService.getCollateralCategories(this.applicationDetails.typesOfLoan,collateral).subscribe(
      res => {
        this.collateralCategory = Array.from(new Set(res.collateralCategory));
        this.collateralType[index] = Array.from(new Set(res.collateralType));
      }
    )
  }
}

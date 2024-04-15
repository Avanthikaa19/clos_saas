import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationDetails, DynamicUploads, MultipleDetails, ProxyOverallDetails, Statement } from 'src/app/c-los/models/clos';
import { Attachment, PageData } from 'src/app/c-los/models/clos-table';
import { CLosService } from 'src/app/c-los/service/c-los.service';
import { ApplicationEntryService } from '../service/application-entry.service';
import { EncryptDecryptService } from 'src/app/services/encrypt-decrypt.service';
import { DuplicateCheckingService } from 'src/app/duplicate-checking/services/duplicate-checking.service';
import { UserDefinedCustomFields } from 'src/app/loan-application/components/models/config.models';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  appId: number;
  filteredLoanList: any[];
  loanConfigList: any;
  page: number = 1;
  pageData: PageData;
  userCustomFields: UserDefinedCustomFields = new UserDefinedCustomFields();
  categories = [
    { key: 'businessRegistration', label: 'Business Registration / Partnership Deed (Partnership only) / Latest Forms' },
    { key: 'photoCopyOfNRIC', label: 'Photocopy of NRIC for Sole Proprietor / Partners' },
    { key: 'latest3YearsManagementAccounts', label: 'Latest 3 years’ Management Accounts' },
    { key: 'latest_6Months_BankStatements', label: 'Latest 6 months’ Bank Statements' },
    { key: 'latest_3Years_IncomeTaxReturns', label: 'Latest 3 years’ Income Tax Returns (Form B / Form P / Form PT) & Tax Receipts' },
    { key: 'projectProposal', label: 'Project proposal / agreement / contract on sustainability' },
    { key: 'greenCertification', label: 'Green Certification' },
    { key: 'smeIndustry', label: 'SME Industry Certification' },
    { key: 'collateralDocument', label: 'Collateral Document' },
    { key: 'balanceSheet', label: 'Balance sheet' },
    { key: 'incomeStatement', label: 'Income Statement' },
    { key: 'cashFlowStatement', label: 'Cash Flow Statement' },
    { key: 'addDocument', label: 'Additional Documents' },
    { key: 'KYCProofs', label: 'KYC Proofs' },
    { key: 'KYCofApplicant', label: 'KYC of Applicant' },
    { key: 'KYCofDirector', label: 'KYC of Director' },
    { key: 'KYCofCompany', label: 'KYC of Company' }
    // Add other categories here
  ];
  // applicationDetails: ApplicationDetails; // Updated ApplicationDetails model
  applicationDetails: ApplicationDetails = new ApplicationDetails();
  multipleDetails: MultipleDetails = new MultipleDetails();
  newApplicationDetails: ApplicationDetails = new ApplicationDetails();
  uploadedFiles: { [key: string]: File[] } = {}; // Define uploadedFiles to store File objects
  files: File[] = [];
  shareHolderDetails: any;
  statement: Statement[] = [];
  uploadsList: any[] = [];
  uploadsNamesList: any[] = [];
  dynamicUploads: DynamicUploads[] = [];
  loading: boolean = false;
  action: string;
  getParentId: number;
  collateralDetails: any;
  suppliersDetails: any;
  uploadFiles: any[] = [];

  constructor(
    private applicationEntryService: ApplicationEntryService,
    public closService: CLosService,
    public router: Router,
    public encryptDecryptService: EncryptDecryptService,
    private cdr: ChangeDetectorRef,
    public dupliateService: DuplicateCheckingService
  ) {
    let decryptId = this.encryptDecryptService.decryptData(sessionStorage.getItem('appId'))
    this.appId = +decryptId;
    if (Object.keys(this.applicationEntryService.applicationDetails).length === 0 && this.appId) {
      this.getDataById();
    }
    if (this.appId) {
      this.getStatementFields();
      this.getDynamicUploads();
    }
    // INITIALIZING PAGEDATA
    this.pageData = new PageData();
    this.pageData.currentPage = 1;
    this.pageData.pageSize = 10;
    this.getParentId = this.closService.getFsIds();
    this.action = this.closService.getAction();
    if (this.action === 'ADDITIONAL_LOAN') {
      this.getAdditionalLoanDetails();
    }
    // if(this.action === 'ROLL_OVER'){
    //   this.applicationDetails.id = null;
    // }
  }


  ngOnInit(): void {
    this.applicationDetails = this.applicationEntryService.applicationDetails;
    if (!this.appId) {
      this.getUploadsByLoanType();
      this.shareHolderDetails = this.applicationEntryService.shareHoldersDetails;
      this.suppliersDetails = this.applicationEntryService.suppliersDetails;
      this.collateralDetails = this.applicationEntryService.collateralsDetails;
      this.getUploadedFiles();
    }
    else {
      this.shareHolderDetails = this.applicationEntryService.shareHolders;
      this.suppliersDetails = this.applicationEntryService.suppliers;
      this.getMultipleDetails();
    }

  }

  getMultipleDetails() {
    this.closService.getMultipleDetails(this.appId).subscribe(
      res => {
        this.collateralDetails = res.collateralDetails;
        this.getUploadedFiles();
      }
    )
  }

  getUploadedFiles() {
    let collateralValue: any[] = [];
    let shareHoldersValue: any[] = [];
    let suppliersValue: any[] = [];
    
    if (this.collateralDetails) {
      this.collateralDetails.forEach(document => {
        if (document.collateralDocuments) {
          collateralValue.push(...document.collateralDocuments);
        }
      })
    }
    if (this.shareHolderDetails) {
      this.shareHolderDetails.forEach(document => {
        if (document.shareholdersAuthorizedSignatures) {
          shareHoldersValue.push(...document.shareholdersAuthorizedSignatures);
        }
      })
    }
    if (this.suppliersDetails) {
      this.suppliersDetails.forEach(document => {
        if (document.supplierAgreement) {
          suppliersValue.push(...document.supplierAgreement);
        }
      })
    }
    const detailsToCheck = [
      {
        details: this.applicationDetails.applicantSignature,
        signatureType: 'Applicant Signature',
      },
      {
        details: this.applicationDetails.vendorsAgreement,
        signatureType: 'Vendors Agreement',
        remarks: this.applicationDetails.vendorsAgreementUploadsRemarks
      },
      {
        details: this.applicationDetails.suppliersAgreement,
        signatureType: 'Suppliers Agreement',
        remarks: this.applicationDetails.suppliersAgreementUploadsRemarks
      },
      {
        details: this.applicationDetails.partnersAgreement,
        signatureType: 'Partners Agreement',
        remarks: this.applicationDetails.partnersAgreementUploadsRemarks
      },
      {
        details: shareHoldersValue,
        signatureType: 'Authorized Signature',
        remarks: this.shareHolderDetails.shareholdersAuthorizedSignaturesRemarks
      },
      {

        details: collateralValue,
        signatureType: 'Collateral Documents',
        remarks: this.collateralDetails?.collateralDocumentsRemarks
      },
      {
        details: this.applicationDetails.guarantorAgreement,
        signatureType: 'Guarantor Agreement',
        remarks: this.applicationDetails.guarantorAgreementRemarks
      },
      {
        details: suppliersValue,
        signatureType: 'Supplier Agreement',
        remarks: this.suppliersDetails.supplierAgreementRemarks
      },
      {
        details: this.applicationDetails.latestInterimFinancialStatement,
        signatureType: 'Latest Interim Financial Statement',
        remarks: this.applicationDetails.latestInterimFinancialStatementUploadsRemarks
      },
      {
        details: this.applicationDetails.financialStatementOfPast5Years,
        signatureType: 'Financial Statement of Past 5 Years',
        remarks: this.applicationDetails.financialStatementOfPast5YearsUploadsRemarks
      },
      {
        details: this.applicationDetails.taxReturnsForTheLast3Years,
        signatureType: 'Tax Returns For The Last 3 Years',
        remarks: this.applicationDetails.taxReturnsForTheLast3YearsUploadsRemarks
      },
    ];
    console.log(shareHoldersValue)
    for (const detail of detailsToCheck) {
      if (detail.details && detail.details.length > 0) {
        const signatureAttachments = detail.details;
        const signatureEntry = {
          name: detail.signatureType,
          attachments: signatureAttachments,
          remarks: detail.remarks
        };
        this.uploadFiles.push(signatureEntry);
      }
    }
    console.log(this.uploadedFiles)
  }


  getDataById() {
    if (this.action === 'ADDITIONAL_LOAN') {
      this.getAdditionalLoanDetails();
    }
    else {
      this.closService.getApplicationDetailsByID(this.appId).subscribe(
        res => {
          this.applicationDetails = res;
          console.log(res);
          if (this.action === 'ROLL_OVER') {
            res['id'] = null;
            res['applicationId'] = null;
            this.appId = null;
            delete res['applicationResult'];
          }
        }
      )
    }
  }
  getStatementFields() {
    this.closService.getstatement(this.appId, 1, 10).subscribe(
      res => {
        this.statement = res['data'];
        console.log(res)
      }
    )
  }

  getUploadsByLoanType() {
    this.loading = true;
    this.closService.getUploadsByLoanType(this.applicationDetails.typesOfLoan).subscribe(
      res => {
        this.dynamicUploads = res.map((name) => ({
          name: name,
          id: null,
          applicationId: null,
          remarks: '',
          attachmentResponse: []
        }));
        this.loading = false;
        console.log(this.dynamicUploads);
      }
    )
  }

  saveApplicationData() {
    this.applicationEntryService.applicationDetails = this.applicationDetails;
  }

  saveMultipleDetails(applicationID: number) {
    const shareHolders = this.applicationEntryService.shareHoldersDetails;
    const partnership = this.applicationEntryService.partnersDetails;
    const collaterals = this.applicationEntryService.collateralsDetails;
    const suppliers = this.applicationEntryService.suppliersDetails;

    shareHolders?.forEach(shareHolder => {
      shareHolder.applicationId = applicationID;
    });

    partnership?.forEach(partner => {
      partner.applicationId = applicationID;
    });

    collaterals?.forEach(collateral => {
      collateral.applicationId = applicationID;
    });

    suppliers?.forEach(supplier => {
      supplier.applicationId = applicationID;
    });
    const formattedData = [
      {
        shareHolders: shareHolders?.map(shareholder => {
          return {
            id: shareholder.id,
            applicationId: shareholder.applicationId,
            shareholderName: shareholder.shareholderName,
            shareholdersDesignation: shareholder.shareholdersDesignation,
            shareholdersContactNumber: shareholder.shareholdersContactNumber,
            shareholdersOfficeAddress: shareholder.shareholdersOfficeAddress,
            shareholdersHomeAddress: shareholder.shareholdersHomeAddress,
            shareholdersMailId: shareholder.shareholdersMailId,
            shareholdersPassportNumber: shareholder.shareholdersPassportNumber,
            shareholdersDob: shareholder.shareholdersDob,
            shareholdersAge: shareholder.shareholdersAge,
            shareholdersNationId: shareholder.shareholdersNationId,
            shareholdersTin: shareholder.shareholdersTin,
            shareholdersAuthorizedSignatures: shareholder.shareholdersAuthorizedSignatures
          };
        }),
        partnership: partnership?.map(partner => {
          return {
            id: partner.id,
            applicationId: partner.applicationId,
            partnershipEntityName: partner.partnershipEntityName,
            partnershipDirectorName: partner.partnershipDirectorName,
            partnershipOfficeAddress: partner.partnershipOfficeAddress,
            partnershipContactNumber: partner.partnershipContactNumber,
            partnershipMailId: partner.partnershipMailId,
            ultimateBeneficialOwner: partner.ultimateBeneficialOwner,
            kycdocumentNumber: partner.kycdocumentNumber,
            uniqueIdentifier: partner.uniqueIdentifier,
          };
        }),
        collateralDetails: collaterals?.map(collateral => {
          return {
            id: collateral.id,
            applicationId: collateral.applicationId,
            collateralAmount: collateral.collateralAmount,
            collateralValue: collateral.collateralValue,
            collateralCurrency: collateral.collateralCurrency,
            collateralType: collateral.collateralType,
            marketValue: collateral.marketValue,
            collateralAsset: collateral.collateralAsset,
            collateralDescription: collateral.collateralDescription,
            collateralCategory: collateral.collateralCategory,
            haircut: collateral.haircut,
            loanToValueRatio: collateral.loanToValueRatio,
            collateralDocuments: collateral.collateralDocuments,
            collateralDocumentsRemarks: collateral.collateralDocumentsRemarks
          };
        }),
        suppliers: suppliers?.map(supplier => {
          return {
            id: supplier.id,
            applicationId: supplier.applicationId,
            supplierCompanyName: supplier.supplierCompanyName,
            supplierCompanyContactNumber: supplier.supplierCompanyContactNumber,
            supplierContactPerson: supplier.supplierContactPerson,
            supplierContactNumber: supplier.supplierContactNumber,
            supplierContactEmail: supplier.supplierContactEmail,
            supplierCompanyAddress: supplier.supplierCompanyAddress,
            supplierCompanyRegistrationNumber: supplier.supplierCompanyRegistrationNumber,
            supplierAgreement: supplier.supplierAgreement,
            supplierAgreementRemarks: supplier.supplierAgreementRemarks
          };
        })
      }
    ];
    this.closService.saveMultipleDetails(formattedData).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  OnSubmitBtnClick() {
    this.applicationDetails.initialStatus = 'UI_INITIATED';
    this.applicationDetails.status = 'UI_INITIATED';
    console.log('Application Details', this.applicationDetails);
    Object.keys(this.applicationDetails).forEach(key => {
      let value = this.applicationDetails[key];
      if (typeof value === 'string' && value.includes(',')) {
        this.applicationDetails[key] = parseFloat(value.replace(/,/g, ''));
      }
    });
    if (this.action === 'ROLL_OVER') {
      this.applicationDetails.status = 'ROLL_OVER';
      this.applicationDetails.parentId = this.getParentId;
      this.applicationDetails.loanStatus = 'ROLL_OVER'
    }
    else if (this.action === 'EXTENSION_OF_LOAN') {
      this.applicationDetails.status = 'EXTENSION_OF_LOAN';
      this.applicationDetails.parentId = this.getParentId;
      this.applicationDetails.loanStatus = 'EXTENSION_OF_LOAN'
    }
    if (this.action === 'ROLL_OVER' || this.action === 'EXTENSION_OF_LOAN') {
      this.applicationDetails.id = null;
      this.appId = null;
    }
    if (!this.applicationDetails.id) {
      this.closService.saveApplication(this.applicationDetails).subscribe(
        res => {
          console.log(res);
          const generatedId = res['id'];
          this.closService.generatedId = generatedId;
          this.saveCustomFields(res['id']);
          this.saveMultipleDetails(res['id']);
          this.saveDyanamicUploadData(res['id']);
          this.saveStatementFields();
          if(res['financialProxyCompany'] == 'Yes'){
            this.saveProxyCompanyDetails(res['id']);
            this.saveProxyFinancialInfo();
          }
          for (const key in this.applicationDetails) {
            if (this.applicationDetails.hasOwnProperty(key)) {
              this.applicationDetails[key] = null;
            }
          }
          if (this.action === 'ROLL_OVER') {
            this.saveRolloverDetails(res['id']);
          }
          if (this.action === 'EXTENSION_OF_LOAN') {
            this.saveExtensioOfLoanDetails(res['id']);
          }
          this.router.navigate(['application-entry', 'application-view']);
        })
    }
    else {
      if (this.action === 'ROLL_OVER' || this.action === 'EXTENSION_OF_LOAN') {
        this.applicationDetails.id = null;
        this.appId = null;
        this.applicationDetails.applicationId = null;
        this.applicationDetails.parentId = this.getParentId;
      }
      this.closService.updateApplicantDetails(this.applicationDetails.id, this.applicationDetails).subscribe(
        res => {
          console.log(res);
          const generatedId = res['id'];
          this.closService.generatedId = generatedId;
          this.applicationEntryService.applicationDetails = this.applicationDetails;
          this.saveMultipleDetails(res['id']);
          this.saveCustomFields(res['id']);
          this.saveDyanamicUploadData(res['id']);
          if(res['financialProxyCompany'] == 'Yes'){
            this.saveProxyCompanyDetails(res['id']);
            this.saveProxyFinancialInfo();
          }
          if (this.action === 'ROLL_OVER' || this.applicationDetails.loanStatus === 'ROLL_OVER') {
            this.saveRolloverDetails(res['id']);
            this.applicationDetails.parentId = res['id'];
          }
          if (this.action === 'EXTENSION_OF_LOAN' || this.applicationDetails.loanStatus === 'EXTENSION_OF_LOAN') {
            this.saveExtensioOfLoanDetails(res['id']);
            this.applicationDetails.parentId = res['id'];
          }
          this.saveStatementFields();
          this.router.navigate(['application-entry', 'application-view']);
          for (const key in this.applicationDetails) {
            if (this.applicationDetails.hasOwnProperty(key)) {
              this.applicationDetails[key] = null;
            }
          }
        })
    }
  }

  OnDraftBtnClick() {
    if (this.action === 'ROLL_OVER' || this.action === 'EXTENSION_OF_LOAN') {
      this.applicationDetails.id = null;
      this.appId = null;
    }
    this.applicationDetails.initialStatus = 'DRAFT';
    this.applicationDetails.status = 'DRAFT';
    this.applicationDetails.appStatus = 'DRAFT';
    Object.keys(this.applicationDetails).forEach(key => {
      let value = this.applicationDetails[key];
      if (typeof value === 'string' && value.includes(',') && !key.endsWith('Address')) {
        this.applicationDetails[key] = parseFloat(value.replace(/,/g, ''));
      }
    });
    if (this.action === 'EXTENSION_OF_LOAN') {
      this.applicationDetails.loanStatus = 'EXTENSION_OF_LOAN';
      this.applicationDetails.status = 'EXTENSION_OF_LOAN';
    }
    if (this.action === 'ROLL_OVER') {
      this.applicationDetails.loanStatus = 'ROLL_OVER';
      this.applicationDetails.status = 'ROLL_OVER';
    }
    this.closService.saveApplication(this.applicationDetails).subscribe(
      res => {
        const generatedId = res['id'];
        this.closService.generatedId = generatedId;
        this.saveStatementFields();
        for (const key in this.applicationDetails) {
          if (this.applicationDetails.hasOwnProperty(key)) {
            this.applicationDetails[key] = null;
          }
        }
        this.saveCustomFields(res['id']);
        this.saveMultipleDetails(res['id']);
        this.saveDyanamicUploadData(res['id']);
        console.log('proxy data',this.applicationDetails)
        if(res['financialProxyCompany'] == 'Yes'){
          this.saveProxyCompanyDetails(res['id']);
          this.saveProxyFinancialInfo();
        }
        this.saveExtensioOfLoanDetails(res['id']);
        this.saveRolloverDetails(res['id']);
        this.router.navigate(['application-entry', 'application-view']);
      })
  }


  formFileResponseData(attachementName: string, attachmentId: number) {
    let attachmentResponse = new Attachment()
    attachmentResponse.attachmentId = attachmentId;
    attachmentResponse.attachmentName = attachementName;
    return attachmentResponse
  }

  saveDyanamicUploadData(id: number) {
    this.dynamicUploads.forEach(upload => {
      upload.applicationId = id;
    })
    this.closService.saveDynamicUploads(this.dynamicUploads).subscribe(
      res => {
        console.log(res);
      }
    )
  }
  getDynamicUploads() {
    this.loading = true;
    this.closService.getDynamicUploads(this.appId).subscribe(
      res => {
        this.loading = false;
        this.dynamicUploads = res;
        console.log(this.dynamicUploads);
      }
    )
  }

  uploadAttachments(field: string, index: number) {
    for (let i = 0; i < this.files.length; i++) {
      this.closService.uploadAttachment(this.files[i]).subscribe(
        res => {
          if (!this.dynamicUploads[index].attachmentResponse) {
            this.dynamicUploads[index].attachmentResponse = []; // Initialize the array if it's not defined
          }
          let response = this.formFileResponseData(res.attachmentName, res.attachmentId);
          this.dynamicUploads[index].attachmentResponse.push(response);
          this.cdr.detectChanges();
        }
      );
    }
  }

  onFilesSelected(event: any, field: string, index: number) {
    this.files = event.target.files;
    this.uploadAttachments(field, index);
  }


  removeAttachment(uploadsListIndex: number, attachmentIndex: number) {
    this.dynamicUploads[uploadsListIndex].attachmentResponse.splice(attachmentIndex, 1);
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

  errMsg() {
    if (!this.applicationDetails.applicantName) {
      return '* Applicant Name is a required field';
    }
    if (!this.applicationDetails.dob) {
      return '* Date of Birth is a required field';
    }
    if (!this.applicationDetails.entityName) {
      return '* Entity Name is a required field';
    }
    if (!this.applicationDetails.typesOfLoan) {
      return '* Type of Loan is a required field';
    }
    if (!this.applicationDetails.companyId) {
      return '* Company ID is a required field';
    }
    if (!this.applicationDetails.designation) {
      return '* Designation is a required field';
    }
    if (!this.applicationDetails.legalNameOfTheCompany) {
      return '* Registered Name of the Company is a required field';
    }
    if (!this.applicationDetails.typeOfBusiness) {
      return '* Type of Business is a required field';
    }
    if (!this.applicationDetails.organizationType) {
      return '* Organization Type is a required field';
    }
    if (!this.applicationDetails.businessRegistrationNumber) {
      return '* Business Registration Number is a required field';
    }
    if (!this.applicationDetails.countryOfRegistration) {
      return '* Country of Registration is a required field';
    }
    if (!this.applicationDetails.dateOfIncorporation) {
      return '* Date of Incorporation is a required field';
    }
    if (!this.applicationDetails.corporateTaxIdentificationNumber) {
      return '* Corporate Tax Identification Number is a required field';
    }
    if (!this.applicationDetails.resident) {
      return '* Resident is a required field';
    }
    if (!this.applicationDetails.registeredAddress) {
      return '* Registered Address is a required field';
    }
    if (!this.applicationDetails.officeContactNumber) {
      return '* Office Contact Number is a required field';
    }
    if (!this.applicationDetails.businessOperatingAddress) {
      return '* Business Operating Address is a required field';
    }
    if (!this.applicationDetails.businessEmailAddress) {
      return '* Business Email Address is a required field';
    }
    if (!this.applicationDetails.annualTurnover) {
      return '* Annual Turn Over is a required field';
    }
    if (!this.applicationDetails.businessUniqueIdentifier) {
      return '* Business Unique Identifier is a required field';
    }
    if (!this.applicationDetails.loanAmount) {
      return '* Loan Amount is a required field';
    }
    // if (!this.applicationDetails.valueConversion) {
    //   return '* Currency Conversion in Financial Information is a required field';
    // }
    if (!this.applicationDetails.latestInterimFinancialStatement) {
      return '* Latest Interim Financial Statement in Financial Information is a required field';
    }
    if (!this.applicationDetails.financialStatementOfPast5Years) {
      return '* Financial Statement of Past 5 years is a required field';
    }
    if (!this.applicationDetails.taxReturnsForTheLast3Years) {
      return '* Tax returns for the last 3 years is a required field';
    }    
    
    return ''
  }

  // to disable submit 
  submitDisable() {
    return (
      !this.applicationDetails.applicantName || !this.applicationDetails.entityName || !this.applicationDetails.designation || !this.applicationDetails.companyId ||
      !this.applicationDetails.typesOfLoan || !this.applicationDetails.legalNameOfTheCompany || !this.applicationDetails.typeOfBusiness || !this.applicationDetails.organizationType ||
      !this.applicationDetails.businessRegistrationNumber || !this.applicationDetails.countryOfRegistration || !this.applicationDetails.dateOfIncorporation ||
      !this.applicationDetails.corporateTaxIdentificationNumber || !this.applicationDetails.resident || !this.applicationDetails.registeredAddress || !this.applicationDetails.businessOperatingAddress ||
      !this.applicationDetails.officeContactNumber || !this.applicationDetails.businessEmailAddress || !this.applicationDetails.annualTurnover || !this.applicationDetails.businessUniqueIdentifier || !this.applicationDetails.latestInterimFinancialStatement?.length ||
      !this.applicationDetails.financialStatementOfPast5Years?.length || !this.applicationDetails.taxReturnsForTheLast3Years?.length ||
      !this.applicationDetails.loanAmount ||
      !this.applicationDetails.officeContactNumber || !this.applicationDetails.businessEmailAddress ||
      !this.applicationDetails.dob || !this.applicationDetails.businessOperatingAddress
    );
  }

  // List udf
  getUdfConfigDetails() {
    this.dupliateService.getUserDefine(this.pageData.currentPage, 100).subscribe(
      res => {
        this.loanConfigList = res['data'];
        this.pageData.totalRecords = res['count'];
        this.filteredLoanList = this.loanConfigList;
      }
    )
  }

  // save custom udf
  saveCustomFields(id: number) {
    const userCustomFieldsData = this.applicationEntryService.userCustomFields;
    const generatedId = this.closService.generatedId;
    if (userCustomFieldsData.length > 0 && generatedId !== null) {
      userCustomFieldsData.forEach((field) => {
        field.appId = id;
      });
      this.closService.saveCustomFields(userCustomFieldsData).subscribe(
        (res) => {
          console.log(res);
          this.applicationEntryService.clearUserCustomFields();
        }
      );
    }
  }

  // Financial Information -> Statement -> Save API
  saveStatementFields() {
    const statementCustomFieldsData = this.applicationEntryService.statementDetails;
    const generatedId = this.closService.generatedId;
    if (statementCustomFieldsData.length > 0 && generatedId !== null) {
      statementCustomFieldsData.forEach((field) => {
        field.applicationId = generatedId;
      });
      this.closService.statement(statementCustomFieldsData).subscribe(
        (res) => {
          console.log(res);
          this.applicationEntryService.clearStatementCustomFields();
        }
      );
    }
  }
// Proxy Company Information -> Save API
  saveProxyCompanyDetails(id:number){
    const proxyCompanyInformationData = this.applicationEntryService.proxyCompanyDetails;
    proxyCompanyInformationData['applicationId'] = id;
    this.closService.saveProxyCompanyDetails(proxyCompanyInformationData).subscribe(res => {
      console.log(res);
      this.applicationEntryService.clearProxyFields();
    })
  }
  // Financial Information -> Statement -> Save API
  saveProxyFinancialInfo() {
    const proxyFinancialInfo = this.applicationEntryService.proxystatementDetails;
    const generatedId = this.closService.generatedId;
    if (proxyFinancialInfo.length > 0 && generatedId !== null) {
      proxyFinancialInfo.forEach((field) => {
        field.applicationId = generatedId;
      });
      this.closService.saveProxyFinancialDetails(proxyFinancialInfo).subscribe(
        (res) => {
          console.log(res);
          this.applicationEntryService.clearStatementCustomFields();
        }
      );
    }
  }

  getAdditionalLoanDetails() {
    this.applicationDetails.parentId = this.closService.getFsIds();
    this.closService.getAdditionalLoan(this.applicationDetails.parentId).subscribe(
      res => {
        console.log(res)
        this.applicationDetails = res;
        this.applicationDetails.id = null;
        this.applicationDetails.applicationId = null;
        this.applicationDetails.loanStatus = this.action;
        // Loan Details
        this.applicationDetails.purposeOfLoan = this.applicationEntryService.applicationDetails.purposeOfLoan;
        this.applicationDetails.sourceOfFund = this.applicationEntryService.applicationDetails.sourceOfFund;
        this.applicationDetails.loanAmount = this.applicationEntryService.applicationDetails.loanAmount;
        this.applicationDetails.loanCurrency = this.applicationEntryService.applicationDetails.loanCurrency;
        this.applicationDetails.effectiveRate = this.applicationEntryService.applicationDetails.effectiveRate;
        this.applicationDetails.downPaymentAmount = this.applicationEntryService.applicationDetails.downPaymentAmount;
        this.applicationDetails.valueDate = this.applicationEntryService.applicationDetails.valueDate;
        this.applicationDetails.maturityDate = this.applicationEntryService.applicationDetails.maturityDate;
        this.applicationDetails.instalments = this.applicationEntryService.applicationDetails.instalments;
        this.applicationDetails.frequency = this.applicationEntryService.applicationDetails.frequency;
        this.applicationDetails.businessDebitCard = this.applicationEntryService.applicationDetails.businessDebitCard;
        this.applicationDetails.termLoan = this.applicationEntryService.applicationDetails.termLoan;
        this.applicationDetails.intrestRateType = this.applicationEntryService.applicationDetails.intrestRateType;
        this.applicationDetails.requestRepaymentFrequency = this.applicationEntryService.applicationDetails.requestRepaymentFrequency;
        this.applicationDetails.loanApprovalAmount = this.applicationEntryService.applicationDetails.loanApprovalAmount;
        this.applicationDetails.interestRate = this.applicationEntryService.applicationDetails.interestRate;
        // Collateral Details
        this.applicationDetails.collateralAmount = this.applicationEntryService.applicationDetails.collateralAmount;
        this.applicationDetails.collateralAsset = this.applicationEntryService.applicationDetails.collateralAsset;
        this.applicationDetails.collateralDescription = this.applicationEntryService.applicationDetails.collateralDescription;
        this.applicationDetails.collateralCurrency = this.applicationEntryService.applicationDetails.collateralCurrency;
        this.applicationDetails.collateralValue = this.applicationEntryService.applicationDetails.collateralValue;
        this.applicationDetails.collateralCategory = this.applicationEntryService.applicationDetails.collateralCategory;
        this.applicationDetails.collateralType = this.applicationEntryService.applicationDetails.collateralType;
        this.applicationDetails.haircut = this.applicationEntryService.applicationDetails.haircut;
        this.applicationDetails.loanToValueRatio = this.applicationEntryService.applicationDetails.loanToValueRatio;
        this.applicationDetails.marketValue = this.applicationEntryService.applicationDetails.marketValue;
        this.applicationDetails.supportingSecurity = this.applicationEntryService.applicationDetails.supportingSecurity;
        this.applicationDetails.debenture = this.applicationEntryService.applicationDetails.debenture;
        this.applicationDetails.corporateGuarantee = this.applicationEntryService.applicationDetails.corporateGuarantee;
        this.applicationDetails.collateralDocuments = this.applicationEntryService.applicationDetails.collateralDocuments;
        this.applicationDetails.collateralDocumentsRemarks = this.applicationEntryService.applicationDetails.collateralDocumentsRemarks;
        this.applicationDetails.guarantorAgreement = this.applicationEntryService.applicationDetails.guarantorAgreement;
        this.applicationDetails.guarantorAgreementRemarks = this.applicationEntryService.applicationDetails.guarantorAgreementRemarks;
        this.applicationDetails.companyName = this.applicationEntryService.applicationDetails.companyName;
        this.applicationDetails.coverType = this.applicationEntryService.applicationDetails.coverType;
        this.applicationDetails.amount = this.applicationEntryService.applicationDetails.amount;
        this.applicationDetails.period = this.applicationEntryService.applicationDetails.period;
      }
    )
  }

  // save roll over
  saveRolloverDetails(id: number) {
    this.applicationEntryService.rollOverDetails.applicationId = id;
    const rollOverFieldsData = this.applicationEntryService.rollOverDetails;
    this.closService.saverollOverDetails(rollOverFieldsData).subscribe(
      res => {
        console.log(res);
        const rollgeneratedId = res['id'];
        this.applicationEntryService.setGeneratedId(rollgeneratedId);
      }
    )
  }

  // save extension
  saveExtensioOfLoanDetails(id: number) {
    this.applicationEntryService.extensionloandetails.applicationId = id;
    const extensionFieldsData = this.applicationEntryService.extensionloandetails;
    this.closService.saveextensionOfLoanDetails(extensionFieldsData).subscribe(
      res => {
        console.log(res);
        const extensiongeneratedId = res['id'];
        this.applicationEntryService.setGeneratedId(extensiongeneratedId);
      }
    )
  }
}
